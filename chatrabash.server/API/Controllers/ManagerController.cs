using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace API.Controllers;

[Authorize(Roles = "Manager")] 
[Route("api/[controller]")]
[ApiController]
public class ManagerController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public ManagerController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 

        if (string.IsNullOrEmpty(managerHostelId)) 
            return BadRequest("Hostel ID missing in token.");

        var pendingUsers = await _userManager.Users
            .Where(u => u.HostelId == managerHostelId && !u.IsApproved)
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
        var managerHostelId = User.FindFirstValue("HostelId"); 

        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null) return NotFound("User not found.");
        
        if (user.HostelId != managerHostelId) 
            return StatusCode(403, "You can only approve users of your own hostel.");

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