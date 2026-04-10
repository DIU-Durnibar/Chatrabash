using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;
using API.DTOs;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.Controllers;

[AllowAnonymous] 
public class HostelsController : BaseController
{
    private readonly AppDbContext _context;

    public HostelsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult>  GetHostels()
    {
        var hostels = await _context.Hostels
            .Include(h => h.Manager) 
            .Select(h => new 
            {
                Id = h.Id,
                Name = h.Name,
                ManagerName = h.Manager != null ? h.Manager.DisplayName : "N/A",
                ManagerPhone = h.Manager != null ? h.Manager.PhoneNumber : "N/A"
            })
            .ToListAsync();

        return SuccessResponse("Hostels loaded successfully", hostels);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchHostels([FromQuery] HostelSearchDto searchParams)
    {
        var query = _context.Hostels
            .Include(h => h.Upazila)
            .Include(h => h.Rooms.Where(r => r.IsActive && r.SeatAvailable > 0))
            .Where(h => h.IsActive)
            .AsQueryable();

        if (searchParams.DivisionId.HasValue)
            query = query.Where(h => h.DivisionId == searchParams.DivisionId.Value);
            
        if (searchParams.DistrictId.HasValue)
            query = query.Where(h => h.DistrictId == searchParams.DistrictId.Value);
            
        if (searchParams.UpazilaId.HasValue)
            query = query.Where(h => h.UpazilaId == searchParams.UpazilaId.Value);

        if (searchParams.MinPrice.HasValue)
            query = query.Where(h => h.Rooms.Any(r => r.MonthlyRent >= searchParams.MinPrice.Value));

        if (searchParams.MaxPrice.HasValue)
            query = query.Where(h => h.Rooms.Any(r => r.MonthlyRent <= searchParams.MaxPrice.Value));

        if (searchParams.HasAc.HasValue && searchParams.HasAc.Value)
            query = query.Where(h => h.Rooms.Any(r => r.IsAcAvailable));

        if (searchParams.HasAttachedBath.HasValue && searchParams.HasAttachedBath.Value)
            query = query.Where(h => h.Rooms.Any(r => r.IsAttachedBathroomAvailable));

        var result = await query.Select(h => new 
        {
            Id = h.Id,
            Name = h.Name,
            Location = h.AreaDescription + (h.Upazila != null ? $", {h.Upazila.Name}" : ""),
            StartingPrice = h.Rooms.Any() ? h.Rooms.Min(r => r.MonthlyRent) : 0,
            EstimatedMonthlyFrom = h.Rooms.Any()
                ? h.Rooms.Min(r => r.EstimatedMonthlyCost ?? r.MonthlyRent)
                : 0,
            AvailableSeats = h.Rooms.Sum(r => r.SeatAvailable),
            HasAc = h.Rooms.Any(r => r.IsAcAvailable),
            HasAttachedBath = h.Rooms.Any(r => r.IsAttachedBathroomAvailable),
            h.Rating,
            h.ReviewCount
        }).ToListAsync();

        return SuccessResponse($"{result.Count} hostels found.", result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHostelDetails(string id)
    {
        var hostel = await _context.Hostels
            .Include(h => h.Manager)
            .Include(h => h.Upazila)
            .Include(h => h.District)
            .Include(h => h.Rooms.Where(r => r.IsActive))
            .Include(h => h.Photos)
            .FirstOrDefaultAsync(h => h.Id == id && h.IsActive);

        if (hostel == null) 
            return ErrorResponse("Hostel not found or inactive.", StatusCodes.Status404NotFound);

        var reviewPreview = await _context.HostelReviews.AsNoTracking()
            .Where(r => r.HostelId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .Join(_context.Users.AsNoTracking(), r => r.UserId, u => u.Id, (r, u) => new
            {
                r.Rating,
                r.Comment,
                r.CreatedAt,
                Author = u.DisplayName ?? u.UserName ?? "বোর্ডার"
            })
            .ToListAsync();

        var photos = hostel.Photos
            .OrderByDescending(p => p.IsMain)
            .ThenBy(p => p.Id)
            .Select(p => new { p.Id, p.Url, p.IsMain })
            .ToList();

        var details = new 
        {
            Id = hostel.Id,
            Name = hostel.Name,
            FullAddress = $"{hostel.AreaDescription}, {hostel.Upazila?.BengaliName}, {hostel.District?.BengaliName}",
            Rating = hostel.Rating,
            ReviewCount = hostel.ReviewCount,
            ManagerInfo = new 
            {
                Name = hostel.Manager?.DisplayName ?? "N/A",
                Phone = hostel.Manager?.PhoneNumber ?? "N/A"
            },
            StartingPrice = hostel.Rooms.Any() ? hostel.Rooms.Min(r => r.MonthlyRent) : 0,
            EstimatedMonthlyFrom = hostel.Rooms.Any()
                ? hostel.Rooms.Min(r => r.EstimatedMonthlyCost ?? r.MonthlyRent)
                : 0,
            TotalAvailableSeats = hostel.Rooms.Sum(r => r.SeatAvailable),
            Amenities = new 
            {
                HasAc = hostel.Rooms.Any(r => r.IsAcAvailable),
                HasAttachedBath = hostel.Rooms.Any(r => r.IsAttachedBathroomAvailable),
                HasBalcony = hostel.Rooms.Any(r => r.IsBalconyAvailable)
            },
            Photos = photos,
            RecentReviews = reviewPreview,
            AvailableRooms = hostel.Rooms.Where(r => r.SeatAvailable > 0).Select(r => new 
            {
                r.Id,
                r.RoomNumber,
                r.FloorNo,
                r.SeatAvailable,
                r.MonthlyRent,
                EstimatedMonthlyCost = r.EstimatedMonthlyCost,
                EffectiveEstimatedMonthly = r.EstimatedMonthlyCost ?? r.MonthlyRent,
                Type = r.IsAcAvailable ? "AC" : "Non-AC"
            }).ToList()
        };

        return SuccessResponse("Hostel details fetched successfully.", details);
    }

    [HttpGet("{id}/reviews")]
    public async Task<IActionResult> GetHostelReviews(string id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var exists = await _context.Hostels.AsNoTracking().AnyAsync(h => h.Id == id && h.IsActive);
        if (!exists)
            return ErrorResponse("Hostel not found or inactive.", StatusCodes.Status404NotFound);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var q = _context.HostelReviews.AsNoTracking()
            .Where(r => r.HostelId == id)
            .OrderByDescending(r => r.CreatedAt);

        var total = await q.CountAsync();
        var slice = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        var userIds = slice.Select(r => r.UserId).Distinct().ToList();
        var users = await _context.Users.AsNoTracking().Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id);

        var items = slice.Select(r => new
        {
            r.Rating,
            r.Comment,
            r.CreatedAt,
            Author = users.TryGetValue(r.UserId, out var u) ? (u.DisplayName ?? u.UserName ?? "বোর্ডার") : "বোর্ডার"
        }).ToList();

        return SuccessResponse("Reviews loaded.", new { total, page, pageSize, items });
    }

    [HttpGet("search-rooms")]
    public async Task<IActionResult> SearchRooms([FromQuery] RoomSearchDto searchParams)
    {
        var query = _context.Rooms
            .Include(r => r.Hostel)
            .Where(r => r.IsActive && r.SeatAvailable > 0)
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchParams.HostelId))
            query = query.Where(r => r.HostelId == searchParams.HostelId);

        if (searchParams.SeatCapacity.HasValue)
            query = query.Where(r => r.SeatCapacity == searchParams.SeatCapacity.Value);

        if (searchParams.IsAcAvailable.HasValue)
            query = query.Where(r => r.IsAcAvailable == searchParams.IsAcAvailable.Value);

        if (searchParams.IsAttachedBathroomAvailable.HasValue)
            query = query.Where(r => r.IsAttachedBathroomAvailable == searchParams.IsAttachedBathroomAvailable);

        if (searchParams.IsBalconyAvailable.HasValue)
            query = query.Where(r => r.IsBalconyAvailable == searchParams.IsBalconyAvailable);

        var result = await query.Select(r => new 
        {
            r.Id,
            r.RoomNumber,
            HostelName = r.Hostel != null ? r.Hostel.Name : "N/A",
            r.FloorNo,
            r.SeatCapacity,
            r.SeatAvailable,
            r.MonthlyRent,
            r.EstimatedMonthlyCost,
            EffectiveEstimatedMonthly = r.EstimatedMonthlyCost ?? r.MonthlyRent,
            r.IsAcAvailable,
            r.IsAttachedBathroomAvailable,
            r.IsBalconyAvailable
        }).ToListAsync();

        if (result.Count == 0)
            return ErrorResponse("Kono room paowa jayni. Onno kono requirement diye try korun.", StatusCodes.Status404NotFound);

        return SuccessResponse("Available rooms fetched successfully", result);
    }
}