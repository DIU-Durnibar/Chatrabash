using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

namespace API.Controllers;

[Authorize(Roles = "SuperAdmin")]
public class SuperAdminController : BaseController
{
    private readonly AppDbContext _context;

    public SuperAdminController(AppDbContext context)
    {
        _context = context;
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

    [HttpPatch("hostels/{hostelId}/status")]
    public async Task<IActionResult> ToggleHostelStatus(string hostelId, [FromBody] bool isActive)
    {
        var hostel = await _context.Hostels.FindAsync(hostelId);
        if (hostel == null) return ErrorResponse("Hostel not found.");

        hostel.IsActive = isActive;
        await _context.SaveChangesAsync();

        string status = isActive ? "Activated" : "Suspended";
        return SuccessResponse($"Hostel successfully {status}.");
    }
}