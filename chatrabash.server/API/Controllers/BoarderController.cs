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
using API.Services;

namespace API.Controllers; 

[Authorize(Roles = "Boarder")] 
public class BoarderController : BaseController 
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;
    private readonly ActivityLogger _activity;

    public BoarderController(UserManager<User> userManager, AppDbContext context, ActivityLogger activity)
    {
        _userManager = userManager;
        _context = context;
        _activity = activity;
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

        var bills = await _context.MonthlyBills.AsNoTracking()
            .Where(b => b.UserId == userId)
            .Select(b => new { Due = b.TotalAmount - b.PaidAmount })
            .ToListAsync();
        var totalDue = bills.Sum(b => b.Due);

        var dashboardData = new
        {
            Profile = new 
            {
                Name = user.DisplayName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                Status = user.IsApproved ? "Approved" : "Pending",
                ProfilePictureUrl = string.IsNullOrEmpty(user.ProfilePictureUrl) ? "/default-avatar.svg" : user.ProfilePictureUrl
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
            },
            BillingSummary = new
            {
                TotalDue = totalDue,
                OpenBillCount = bills.Count(b => b.Due > 0)
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

        var payer = await _userManager.FindByIdAsync(userId);
        await _activity.LogAsync(userId, payer?.Email, "Boarder", "MockBillPayment", "Payment", payer?.HostelId, null,
            $"billId={bill.Id},amount={dto.Amount},status={bill.Status}");

        return SuccessResponse($"Mock payment of {dto.Amount} TK successful! Status is now {bill.Status}.");
    }

    [HttpGet("my-review")]
    public async Task<IActionResult> GetMyReview()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return ErrorResponse("Unauthorized.", StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.HostelId))
            return ErrorResponse("User not found.", StatusCodes.Status404NotFound);

        var rev = await _context.HostelReviews.AsNoTracking()
            .FirstOrDefaultAsync(r => r.UserId == userId && r.HostelId == user.HostelId);
        if (rev == null)
            return SuccessResponse("No review yet.", (object?)null);

        return SuccessResponse("Review loaded.", new { rev.Rating, rev.Comment, rev.CreatedAt });
    }

    [HttpPost("review")]
    public async Task<IActionResult> SubmitReview([FromBody] SubmitReviewDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return ErrorResponse("Unauthorized.", StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.HostelId))
            return ErrorResponse("User not found.", StatusCodes.Status404NotFound);

        if (!user.IsApproved)
            return ErrorResponse("Only approved boarders can review their hostel.");

        if (dto.Rating is < 1 or > 5)
            return ErrorResponse("Rating must be between 1 and 5.");

        var hostelId = user.HostelId;
        var existing = await _context.HostelReviews.FirstOrDefaultAsync(r => r.UserId == userId && r.HostelId == hostelId);
        if (existing != null)
        {
            existing.Rating = dto.Rating;
            existing.Comment = dto.Comment ?? "";
            existing.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.HostelReviews.Add(new HostelReview
            {
                UserId = userId,
                HostelId = hostelId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? ""
            });
        }

        await _context.SaveChangesAsync();

        var hostel = await _context.Hostels.FindAsync(hostelId);
        if (hostel != null)
        {
            var list = await _context.HostelReviews.Where(r => r.HostelId == hostelId).ToListAsync();
            hostel.ReviewCount = list.Count;
            hostel.Rating = list.Count == 0 ? 0 : list.Average(r => r.Rating);
            await _context.SaveChangesAsync();
        }

        await _activity.LogAsync(userId, user.Email, "Boarder", "HostelReviewSubmitted", "Review", hostelId, null, $"rating={dto.Rating}");

        return SuccessResponse("Thank you! Your review has been saved.");
    }

}