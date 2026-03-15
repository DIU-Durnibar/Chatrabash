using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ManagerController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public ManagerController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }


    [HttpGet("pending-users/{hostelId}")]
    public async Task<IActionResult> GetPendingUsers(string hostelId)
    {
        var pendingUsers = await _userManager.Users
            .Where(u => u.HostelId == hostelId && !u.IsApproved)
            .Select(u => new 
            { 
                u.Id, 
                u.DisplayName, 
                u.Email, 
                u.UserName 
            })
            .ToListAsync();

        return Ok(pendingUsers);
    }

    [HttpPost("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null) return NotFound("User not found.");
        if (user.IsApproved) return BadRequest("User is already approved.");

        user.IsApproved = true;

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return Ok(new { Message = $"{user.UserName} has been approved successfully." });
        }

        return BadRequest("Failed to approve user.");
    }
}