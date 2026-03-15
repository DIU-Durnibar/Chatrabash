using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;

namespace API.Controllers;

[Authorize(Roles = "Manager")]
public class BillingController : BaseController
{
    private readonly AppDbContext _context;

    public BillingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateBill([FromBody] CreateBillDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId && u.HostelId == managerHostelId);
        if (user == null)
            return ErrorResponse("User not found in your hostel.", StatusCodes.Status404NotFound);

        var existingBill = await _context.MonthlyBills
            .FirstOrDefaultAsync(b => b.UserId == dto.UserId && b.Month == dto.Month && b.Year == dto.Year);
            
        if (existingBill != null)
            return ErrorResponse("A bill for this month already exists for this user.", StatusCodes.Status400BadRequest);

        var totalAmount = dto.SeatRent + dto.MealCharge + dto.UtilityCharge + dto.AdditionalCharge;

        var bill = new MonthlyBill
        {
            UserId = dto.UserId,
            HostelId = managerHostelId,
            Month = dto.Month,
            Year = dto.Year,
            SeatRent = dto.SeatRent,
            MealCharge = dto.MealCharge,
            UtilityCharge = dto.UtilityCharge,
            AdditionalCharge = dto.AdditionalCharge,
            TotalAmount = totalAmount,
            PaidAmount = 0,
            Status = "Unpaid"
        };

        _context.MonthlyBills.Add(bill);
        await _context.SaveChangesAsync();

        return SuccessResponse("Bill created successfully.");
    }

    [HttpPost("pay")]
    public async Task<IActionResult> ReceivePayment([FromBody] MakePaymentDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");

        var managerId = User.FindFirstValue(ClaimTypes.NameIdentifier); 

        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var bill = await _context.MonthlyBills
            .FirstOrDefaultAsync(b => b.Id == dto.BillId && b.HostelId == managerHostelId);

        if (bill == null)
            return ErrorResponse("Bill not found.", StatusCodes.Status404NotFound);

        if (bill.Status == "Paid" || bill.PaidAmount >= bill.TotalAmount)
            return ErrorResponse("This bill is already fully paid.");

        var dueAmount = bill.TotalAmount - bill.PaidAmount;
        if (dto.Amount > dueAmount)
            return ErrorResponse($"Payment amount exceeds due amount. Current due is {dueAmount}.");

        var payment = new PaymentRecord
        {
            MonthlyBillId = bill.Id,
            UserId = bill.UserId, 
            AmountPaid = dto.Amount,
            PaymentMethod = dto.PaymentMethod,
            TransactionId = dto.TransactionId,
            ReceivedByManagerId = managerId ?? string.Empty
        };

        _context.PaymentRecords.Add(payment);

        bill.PaidAmount += dto.Amount;
        
        if (bill.PaidAmount >= bill.TotalAmount)
            bill.Status = "Paid";
        else
            bill.Status = "Partial";

        await _context.SaveChangesAsync();

        return SuccessResponse($"Payment of {dto.Amount} received successfully. Bill status is now {bill.Status}.");
    }

    [HttpPost("generate-bulk")]
    public async Task<IActionResult> GenerateBulkBills([FromBody] BulkBillGenerateDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var activeBoarders = await _context.Users
            .Where(u => u.HostelId == managerHostelId && u.IsApproved && !string.IsNullOrEmpty(u.AllocatedRoomId))
            .ToListAsync();

        if (!activeBoarders.Any())
            return ErrorResponse("No approved boarders found in your hostel to generate bills.");

        var existingBillUserIds = await _context.MonthlyBills
            .Where(b => b.HostelId == managerHostelId && b.Month == dto.Month && b.Year == dto.Year)
            .Select(b => b.UserId)
            .ToListAsync();

        var boardersToBill = activeBoarders.Where(u => !existingBillUserIds.Contains(u.Id)).ToList();

        if (!boardersToBill.Any())
            return SuccessResponse("Bills are already generated for all active boarders for this month.");

        var roomIds = boardersToBill.Select(u => u.AllocatedRoomId).Distinct().ToList();
        var rooms = await _context.Rooms
            .Where(r => roomIds.Contains(r.Id))
            .ToDictionaryAsync(r => r.Id, r => r);

        var newBills = new List<MonthlyBill>();

        foreach (var boarder in boardersToBill)
        {
            decimal seatRent = 0;
            if (rooms.TryGetValue(boarder.AllocatedRoomId!, out var room))
            {
                seatRent = room.MonthlyRent; 
            }

            var totalAmount = seatRent + dto.UtilityCharge + dto.AdditionalCharge + 0; 

            newBills.Add(new MonthlyBill
            {
                UserId = boarder.Id,
                HostelId = managerHostelId,
                Month = dto.Month,
                Year = dto.Year,
                SeatRent = seatRent,
                MealCharge = 0, 
                UtilityCharge = dto.UtilityCharge,
                AdditionalCharge = dto.AdditionalCharge,
                TotalAmount = totalAmount,
                PaidAmount = 0,
                Status = "Unpaid"
            });
        }

        _context.MonthlyBills.AddRange(newBills);
        await _context.SaveChangesAsync();

        return SuccessResponse($"Successfully generated {newBills.Count} new bills. {existingBillUserIds.Count} bills were skipped as they already existed.");
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetBillingAnalytics([FromQuery] int month, [FromQuery] int year)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var bills = await _context.MonthlyBills
            .Where(b => b.HostelId == managerHostelId && b.Month == month && b.Year == year)
            .ToListAsync();

        if (!bills.Any())
            return SuccessResponse("No bills generated for this month yet.", new { 
                TotalBilled = 0, TotalCollected = 0, TotalDue = 0, FullyPaidCount = 0, PendingCount = 0 
            });

        var totalBilled = bills.Sum(b => b.TotalAmount);
        var totalCollected = bills.Sum(b => b.PaidAmount);
        var totalDue = totalBilled - totalCollected;

        var fullyPaidCount = bills.Count(b => b.Status == "Paid");
        var pendingCount = bills.Count(b => b.Status != "Paid"); 

        var analyticsData = new 
        {
            Month = month,
            Year = year,
            TotalBilled = totalBilled,
            TotalCollected = totalCollected,
            TotalDue = totalDue,
            FullyPaidCount = fullyPaidCount,
            PendingCount = pendingCount
        };

        return SuccessResponse("Billing analytics fetched successfully.", analyticsData);
    }
}