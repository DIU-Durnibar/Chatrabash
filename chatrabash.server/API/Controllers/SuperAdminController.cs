using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;
using API.Services;

namespace API.Controllers;

[Authorize(Roles = "SuperAdmin")]
public class SuperAdminController : BaseController
{
    private readonly AppDbContext _context;
    private readonly ActivityLogger _activity;

    public SuperAdminController(AppDbContext context, ActivityLogger activity)
    {
        _context = context;
        _activity = activity;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var totalHostels = await _context.Hostels.CountAsync();
        var activeHostels = await _context.Hostels.CountAsync(h => h.IsActive);
        var totalBoarders = await _context.Users.CountAsync(u => u.HostelId != null);

        var revenue = await _context.Hostels
            .Where(h => h.IsActive && h.SubscriptionPackageId != null)
            .Include(h => h.SubscriptionPackage)
            .SumAsync(h => h.SubscriptionPackage!.MonthlyPrice);

        return SuccessResponse("Platform analytics fetched successfully.", new
        {
            totalHostels,
            activeHostels,
            totalBoarders,
            monthlySaaSRevenue = revenue
        });
    }

    [HttpGet("hostels")]
    public async Task<IActionResult> GetAllHostels()
    {
        var hostels = await _context.Hostels
            .AsNoTracking()
            .Include(h => h.Manager)
            .Include(h => h.SubscriptionPackage)
            .Include(h => h.Division)
            .Include(h => h.District)
            .Include(h => h.Upazila)
            .Include(h => h.Rooms)
            .OrderByDescending(h => h.IsActive)
            .ThenBy(h => h.Name)
            .Select(h => new
            {
                h.Id,
                Name = h.Name,
                h.AreaDescription,
                Status = h.IsActive ? "Active" : "Suspended",
                Package = h.SubscriptionPackage != null ? h.SubscriptionPackage.Name : "N/A",
                MonthlyPackagePrice = h.SubscriptionPackage != null ? h.SubscriptionPackage.MonthlyPrice : (decimal?)null,
                Division = h.Division != null ? h.Division.BengaliName : null,
                District = h.District != null ? h.District.BengaliName : null,
                Upazila = h.Upazila != null ? h.Upazila.BengaliName : null,
                FullAddress = h.AreaDescription + (h.Upazila != null ? $", {h.Upazila.BengaliName}" : "")
                    + (h.District != null ? $", {h.District.BengaliName}" : ""),
                h.ManagerId,
                ManagerName = h.Manager != null ? (h.Manager.DisplayName ?? h.Manager.UserName ?? "N/A") : "N/A",
                ManagerEmail = h.Manager != null ? h.Manager.Email : null,
                ManagerPhone = h.Manager != null ? h.Manager.PhoneNumber : null,
                ManagerUserName = h.Manager != null ? h.Manager.UserName : null,
                ManagerProfilePictureUrl = h.Manager != null && !string.IsNullOrEmpty(h.Manager.ProfilePictureUrl)
                    ? h.Manager.ProfilePictureUrl
                    : "/default-avatar.svg",
                RoomCount = h.Rooms.Count(),
                TotalSeats = h.Rooms.Sum(r => r.SeatCapacity),
                AvailableSeats = h.Rooms.Sum(r => r.SeatAvailable),
                BoarderCount = _context.Users.Count(u => u.HostelId == h.Id && u.IsApproved),
                Location = h.AreaDescription
            })
            .ToListAsync();

        return SuccessResponse("Hostels fetched successfully.", hostels);
    }

    [HttpGet("activity-logs")]
    public async Task<IActionResult> GetActivityLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);
        var q = _context.ActivityLogs.AsNoTracking().OrderByDescending(l => l.CreatedAt);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(l => new
            {
                l.Id,
                l.CreatedAt,
                l.ActorUserId,
                l.ActorEmail,
                l.ActorRole,
                l.Action,
                l.Category,
                l.HostelId,
                l.TargetUserId,
                l.Details
            })
            .ToListAsync();

        return SuccessResponse("Activity logs loaded.", new { total, page, pageSize, items });
    }

    /// <summary>Remove all rows from the platform activity log (super admin only).</summary>
    [HttpDelete("activity-logs")]
    public async Task<IActionResult> ClearAllActivityLogs()
    {
        var removed = await _context.ActivityLogs.ExecuteDeleteAsync();
        return SuccessResponse("সমস্ত অ্যাক্টিভিটি লগ মুছে ফেলা হয়েছে।", new { removed });
    }

    [HttpGet("manager-payments")]
    public async Task<IActionResult> GetManagerPlatformPayments()
    {
        var payments = await _context.ManagerPlatformPayments.AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        if (payments.Count == 0)
            return SuccessResponse("No platform payments yet.", new List<object>());

        var hIds = payments.Select(p => p.HostelId).Distinct().ToList();
        var mIds = payments.Select(p => p.ManagerUserId).Distinct().ToList();
        var hostels = await _context.Hostels.AsNoTracking().Where(h => hIds.Contains(h.Id)).ToDictionaryAsync(h => h.Id);
        var managers = await _context.Users.AsNoTracking().Where(u => mIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id);

        var rows = payments.Select(p => new
        {
            p.Id,
            p.CreatedAt,
            p.Year,
            p.Month,
            p.Amount,
            p.Status,
            p.PaymentMethod,
            p.TransactionId,
            HostelName = hostels.TryGetValue(p.HostelId, out var h) ? h.Name : p.HostelId,
            ManagerName = managers.TryGetValue(p.ManagerUserId, out var m) ? (m.DisplayName ?? m.UserName ?? m.Email) : p.ManagerUserId
        }).ToList();

        return SuccessResponse("Manager platform payments loaded.", rows);
    }

    [HttpPatch("hostels/{hostelId}/status")]
    public async Task<IActionResult> ToggleHostelStatus(string hostelId, [FromBody] bool isActive)
    {
        var hostel = await _context.Hostels.FindAsync(hostelId);
        if (hostel == null) return ErrorResponse("Hostel not found.");

        hostel.IsActive = isActive;
        await _context.SaveChangesAsync();

        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var adminEmail = User.FindFirstValue(ClaimTypes.Email);
        await _activity.LogAsync(adminId, adminEmail, "SuperAdmin", isActive ? "HostelActivated" : "HostelSuspended", "Hostel",
            hostelId, null, hostel.Name);

        string status = isActive ? "Activated" : "Suspended";
        return SuccessResponse($"Hostel successfully {status}.");
    }
}
