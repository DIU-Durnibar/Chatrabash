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

namespace API.Controllers;

[Authorize(Roles = "Manager")]
[Route("api/[controller]")]
[ApiController]
public class ManagerController : ControllerBase
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
        if (string.IsNullOrEmpty(managerHostelId)) return BadRequest("Hostel ID missing in token.");

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

        return Ok(pendingUsers);
    }

    [HttpPost("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(string userId, [FromBody] string allocatedRoomId)
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null) return NotFound("User not found.");
        if (user.HostelId != managerHostelId) return StatusCode(403, "You can only approve users of your own hostel.");
        if (user.IsApproved) return BadRequest("User is already approved.");

        var room = await _context.Rooms.FindAsync(allocatedRoomId);
        if (room == null) return NotFound("Allocated room not found.");
        if (room.SeatAvailable <= 0) return BadRequest("No seats available in this room.");

        user.IsApproved = true;
        user.AllocatedRoomId = allocatedRoomId;

        room.SeatAvailable -= 1;

        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            await _context.SaveChangesAsync();
            return Ok(new { Message = $"{user.UserName} has been approved and assigned to room {room.RoomNumber}." });
        }

        return BadRequest("Failed to approve user.");
    }

    [HttpGet("rooms")]
    public async Task<IActionResult> GetHostelRooms()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        
        if (string.IsNullOrEmpty(managerHostelId)) 
            return BadRequest("Hostel ID missing in token.");
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

        return Ok(rooms);
    }

    [HttpPost("rooms")]
    public async Task<IActionResult> AddRoom([FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId)) return BadRequest("Hostel ID missing in token.");

        var newRoom = new Room
        {
            RoomNumber = roomDto.RoomNumber,
            FloorNo = roomDto.FloorNo,
            SeatCapacity = roomDto.SeatCapacity,
            SeatAvailable = roomDto.SeatCapacity, // নতুন রুমে ক্যাপাসিটি আর ফাঁকা সিট সমান হবে
            IsAttachedBathroomAvailable = roomDto.IsAttachedBathroomAvailable,
            IsBalconyAvailable = roomDto.IsBalconyAvailable,
            IsAcAvailable = roomDto.IsAcAvailable,
            IsActive = roomDto.IsActive,
            HostelId = managerHostelId // ম্যাজিক! রুমটা অটোমেটিক ম্যানেজারের হোস্টেলে অ্যাসাইন হয়ে গেলো
        };

        _context.Rooms.Add(newRoom);
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Room {newRoom.RoomNumber} added successfully." });
    }

    [HttpPut("rooms/{roomId}")]
    public async Task<IActionResult> UpdateRoom(string roomId, [FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) return NotFound("Room not found.");

        if (room.HostelId != managerHostelId) 
            return StatusCode(403, "You can only update rooms in your own hostel.");

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

        return Ok(new { Message = $"Room {room.RoomNumber} updated successfully." });
    }
}