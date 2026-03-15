using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Persistence;
using API.DTOs;
using Microsoft.AspNetCore.Http; 

namespace API.Controllers;

[Authorize(Roles = "Manager")]
public class ManagerController : BaseController 
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context; 

    public ManagerController(UserManager<User> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var pendingUsers = await _userManager.Users
            .Where(u => u.HostelId == managerHostelId && !u.IsApproved)
            .Select(u => new 
            { 
                u.Id, 
                u.DisplayName, 
                u.Email, 
                u.UserName,
                u.PreferredRoomId, 
                u.PreferenceNote 
            })
            .ToListAsync();

        return SuccessResponse("Pending users fetched successfully.", pendingUsers);
    }

    [HttpPost("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(string userId, [FromBody] string allocatedRoomId)
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null) 
            return ErrorResponse("User not found.", StatusCodes.Status404NotFound);
            
        if (user.HostelId != managerHostelId) 
            return ErrorResponse("You can only approve users of your own hostel.", StatusCodes.Status403Forbidden);
            
        if (user.IsApproved) 
            return ErrorResponse("User is already approved.");

        var room = await _context.Rooms.FindAsync(allocatedRoomId);
        if (room == null) 
            return ErrorResponse("Allocated room not found.", StatusCodes.Status404NotFound);
            
        if (room.SeatAvailable <= 0) 
            return ErrorResponse("No seats available in this room.");

        user.IsApproved = true;
        user.AllocatedRoomId = allocatedRoomId;
        room.SeatAvailable -= 1;

        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            await _context.SaveChangesAsync();
            return SuccessResponse($"{user.UserName} has been approved and assigned to room {room.RoomNumber}.");
        }

        return ErrorResponse("Failed to approve user.");
    }

    [HttpGet("rooms")]
    public async Task<IActionResult> GetHostelRooms()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var rooms = await _context.Rooms
            .Where(r => r.HostelId == managerHostelId)
            .OrderBy(r => r.FloorNo)      
            .ThenBy(r => r.RoomNumber)    
            .Select(r => new 
            {
                r.Id,
                r.RoomNumber,
                r.FloorNo,
                r.SeatCapacity,
                r.SeatAvailable,
                r.IsAcAvailable,
                r.IsAttachedBathroomAvailable,
                r.IsBalconyAvailable,
                r.IsActive
            })
            .ToListAsync();

        return SuccessResponse("Rooms fetched successfully.", rooms);
    }

    [HttpPost("rooms")]
    public async Task<IActionResult> AddRoom([FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var newRoom = new Room
        {
            RoomNumber = roomDto.RoomNumber,
            FloorNo = roomDto.FloorNo,
            SeatCapacity = roomDto.SeatCapacity,
            SeatAvailable = roomDto.SeatCapacity, 
            IsAttachedBathroomAvailable = roomDto.IsAttachedBathroomAvailable,
            IsBalconyAvailable = roomDto.IsBalconyAvailable,
            IsAcAvailable = roomDto.IsAcAvailable,
            IsActive = roomDto.IsActive,
            HostelId = managerHostelId 
        };

        _context.Rooms.Add(newRoom);
        await _context.SaveChangesAsync();

        return SuccessResponse($"Room {newRoom.RoomNumber} added successfully.");
    }

    [HttpPut("rooms/{roomId}")]
    public async Task<IActionResult> UpdateRoom(string roomId, [FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);
        
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) 
            return ErrorResponse("Room not found.", StatusCodes.Status404NotFound);

        if (room.HostelId != managerHostelId) 
            return ErrorResponse("You can only update rooms in your own hostel.", StatusCodes.Status403Forbidden);

        room.RoomNumber = roomDto.RoomNumber!;
        room.FloorNo = roomDto.FloorNo;
        room.IsAttachedBathroomAvailable = roomDto.IsAttachedBathroomAvailable;
        room.IsBalconyAvailable = roomDto.IsBalconyAvailable;
        room.IsAcAvailable = roomDto.IsAcAvailable;
        room.IsActive = roomDto.IsActive;

        if (roomDto.SeatCapacity != room.SeatCapacity)
        {
            var difference = roomDto.SeatCapacity - room.SeatCapacity;
            room.SeatAvailable += difference; 
            room.SeatCapacity = roomDto.SeatCapacity;
        }

        await _context.SaveChangesAsync();

        return SuccessResponse($"Room {room.RoomNumber} updated successfully.");
    }
}