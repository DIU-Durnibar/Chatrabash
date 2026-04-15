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
        var totalBoarders = await _context.Users.CountAsync(u => !string.IsNullOrEmpty(u.HostelId) && u.IsApproved);
        var reviewCount = await _context.HostelReviews.CountAsync();

        double? averageRating = null;
        if (reviewCount > 0)
        {
            averageRating = await _context.HostelReviews.AverageAsync(r => (double)r.Rating);
        }

        return SuccessResponse("Stats fetched.", new
        {
            hostels = totalHostels,
            boarders = totalBoarders,
            reviewCount,
            averageRating = averageRating.HasValue ? Math.Round(averageRating.Value, 1) : (double?)null,
        });
    }

    [HttpGet("featured-hostels")]
    public async Task<IActionResult> GetFeaturedHostels()
    {
        var featured = await _context.Hostels
            .Where(h => h.IsActive && h.IsFeatured) 
            .Include(h => h.Upazila)
            .Include(h => h.Photos)
            .Take(3) 
            .Select(h => new 
            {
                Id = h.Id,
                Name = h.Name,
                Location = h.AreaDescription + (h.Upazila != null ? $", {h.Upazila.Name}" : ""),
                StartingPrice = _context.Rooms
                    .Where(r => r.HostelId == h.Id && r.IsActive)
                    .Select(r => (decimal?)r.MonthlyRent)
                    .Min() ?? 0,
                Rating = h.Rating,
                ReviewCount = h.ReviewCount,
                HasAc = _context.Rooms.Any(r => r.HostelId == h.Id && r.IsActive && r.IsAcAvailable),
                HasAttachedBath = _context.Rooms.Any(r => r.HostelId == h.Id && r.IsActive && r.IsAttachedBathroomAvailable),
                MainPhotoUrl = h.Photos
                    .OrderByDescending(p => p.IsMain)
                    .ThenBy(p => p.Id)
                    .Select(p => p.Url)
                    .FirstOrDefault()
            }).ToListAsync();

        return SuccessResponse("Featured hostels loaded.", featured);
    }
}