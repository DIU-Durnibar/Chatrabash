using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;

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
    public async Task<IActionResult> GetHostels()
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
            r.IsAcAvailable,
            r.IsAttachedBathroomAvailable,
            r.IsBalconyAvailable
        }).ToListAsync();

        if (result.Count == 0)
            return ErrorResponse("Kono room paowa jayni. Onno kono requirement diye try korun.", StatusCodes.Status404NotFound);

        return SuccessResponse("Available rooms fetched successfully", result);
    }
}