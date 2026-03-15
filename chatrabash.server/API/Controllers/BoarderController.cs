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
                AttachedBath = allocatedRoom.IsAttachedBathroomAvailable == 1,
                RoomMates = roomMates
            }
        };

        return SuccessResponse("Dashboard data fetched successfully.", dashboardData);
    }
}