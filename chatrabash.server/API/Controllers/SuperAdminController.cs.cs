using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
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

        return SuccessResponse("Platform analytics fetched successfully.", new {
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
            .Include(h => h.Manager)
            .Include(h => h.SubscriptionPackage)
            .Select(h => new {
                h.Id,
                Name = h.Name,
                ManagerName = h.Manager != null ? h.Manager.DisplayName : "N/A",
                Location = h.AreaDescription,
                Package = h.SubscriptionPackage != null ? h.SubscriptionPackage.Name : "N/A",
                Status = h.IsActive ? "Active" : "Suspended"
            }).ToListAsync();

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