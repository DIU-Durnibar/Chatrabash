using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[AllowAnonymous] 
public class PublicController : BaseController
{
    private readonly AppDbContext _context;

    public PublicController(AppDbContext context)
    {
        _context = context;
    }

  
    [HttpGet("landing-stats")]
    public async Task<IActionResult> GetLandingStats()
    {
        var totalHostels = await _context.Hostels.CountAsync(h => h.IsActive);
        var totalBoarders = await _context.Users.CountAsync(u => u.HostelId != null && u.IsApproved);
        
        return SuccessResponse("Stats fetched.", new {
            hostels = totalHostels + 100,
            boarders = totalBoarders + 500,
            growth = "২৫%"
        });
    }

    [HttpGet("featured-hostels")]
    public async Task<IActionResult> GetFeaturedHostels()
    {
        var featured = await _context.Hostels
            .Include(h => h.Upazila)
            .Include(h => h.Rooms.Where(r => r.IsActive && r.SeatAvailable > 0))
            .Where(h => h.IsActive && h.IsFeatured) 
            .Take(3) 
            .Select(h => new 
            {
                Id = h.Id,
                Name = h.Name,
                Location = h.AreaDescription + (h.Upazila != null ? $", {h.Upazila.Name}" : ""),
                StartingPrice = h.Rooms.Any() ? h.Rooms.Min(r => r.MonthlyRent) : 0,
                Rating = h.Rating,
                ReviewCount = h.ReviewCount,
                HasAc = h.Rooms.Any(r => r.IsAcAvailable),
                HasAttachedBath = h.Rooms.Any(r => r.IsAttachedBathroomAvailable)
            }).ToListAsync();

        return SuccessResponse("Featured hostels loaded.", featured);
    }
}