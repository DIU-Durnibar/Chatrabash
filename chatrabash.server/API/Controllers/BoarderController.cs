using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using API.DTOs;

namespace API.Controllers; 

[Authorize(Roles = "Boarder")] 
public class BoarderController : BaseController 
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;

    public BoarderController(UserManager<User> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) 
            return ErrorResponse("Unauthorized access.", StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) 
            return ErrorResponse("User not found.", StatusCodes.Status404NotFound);

        var hostel = await _context.Hostels
            .Include(h => h.Manager)
            .FirstOrDefaultAsync(h => h.Id == user.HostelId);

        Room? allocatedRoom = null;
        if (!string.IsNullOrEmpty(user.AllocatedRoomId))
        {
            allocatedRoom = await _context.Rooms.FindAsync(user.AllocatedRoomId);
        }

        var roomMates = new List<string>();
        if (!string.IsNullOrEmpty(user.AllocatedRoomId))
        {
            roomMates = await _userManager.Users
                .Where(u => u.AllocatedRoomId == user.AllocatedRoomId && u.Id != user.Id)
                .Select(u => u.DisplayName ?? u.UserName)
                .ToListAsync();
        }

        var dashboardData = new
        {
            Profile = new 
            {
                Name = user.DisplayName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                Status = user.IsApproved ? "Approved" : "Pending"
            },
            Hostel = new
            {
                Name = hostel?.Name ?? "N/A",
                ManagerName = hostel?.Manager?.DisplayName ?? "N/A",
                ManagerPhone = hostel?.Manager?.PhoneNumber ?? "N/A"
            },
            Room = allocatedRoom == null ? null : new
            {
                RoomNo = allocatedRoom.RoomNumber,
                Floor = allocatedRoom.FloorNo,
                AcAvailable = allocatedRoom.IsAcAvailable,
                AttachedBath = allocatedRoom.IsAttachedBathroomAvailable == true,
                RoomMates = roomMates
            }
        };

        return SuccessResponse("Dashboard data fetched successfully.", dashboardData);
    }

    [HttpGet("my-bills")]
    public async Task<IActionResult> GetMyBills()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return ErrorResponse("User ID missing in token.", StatusCodes.Status401Unauthorized);

        var myBills = await _context.MonthlyBills
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Year)   
            .ThenByDescending(b => b.Month)
            .Select(b => new 
            {
                b.Id,
                Month = b.Month,
                Year = b.Year,
                b.SeatRent,
                b.MealCharge,
                b.UtilityCharge,
                b.AdditionalCharge,
                b.TotalAmount,
                b.PaidAmount,
                DueAmount = b.TotalAmount - b.PaidAmount, 
                b.Status,
                CreatedAt = b.CreatedAt.ToString("dd MMM, yyyy") 
            })
            .ToListAsync();

        if (!myBills.Any())
            return SuccessResponse("You don't have any bills yet.", new List<object>());

        return SuccessResponse("Your bills fetched successfully.", myBills);
    }

    [HttpPost("pay-bill-mock")]
    public async Task<IActionResult> MockPayBill([FromBody] MakePaymentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return ErrorResponse("User ID missing in token.", StatusCodes.Status401Unauthorized);

        var bill = await _context.MonthlyBills
            .FirstOrDefaultAsync(b => b.Id == dto.BillId && b.UserId == userId);

        if (bill == null)
            return ErrorResponse("Bill not found or doesn't belong to you.", StatusCodes.Status404NotFound);

        if (bill.Status == "Paid" || bill.PaidAmount >= bill.TotalAmount)
            return ErrorResponse("Your bill is already fully paid.");

        var dueAmount = bill.TotalAmount - bill.PaidAmount;
        if (dto.Amount > dueAmount)
            return ErrorResponse($"You cannot pay more than your due amount. Current due is {dueAmount} TK.");

        var payment = new PaymentRecord
        {
            MonthlyBillId = bill.Id,
            UserId = userId,
            AmountPaid = dto.Amount,
            PaymentMethod = "Mock_" + dto.PaymentMethod,
            
            TransactionId = string.IsNullOrEmpty(dto.TransactionId) 
                ? "MOCK_TRX_" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper() 
                : dto.TransactionId,
                
            ReceivedByManagerId = "SYSTEM_AUTO" 
        };

        _context.PaymentRecords.Add(payment);

        bill.PaidAmount += dto.Amount;
        
        if (bill.PaidAmount >= bill.TotalAmount)
            bill.Status = "Paid";
        else
            bill.Status = "Partial";

        await _context.SaveChangesAsync();

        return SuccessResponse($"Mock payment of {dto.Amount} TK successful! Status is now {bill.Status}.");
    }

}