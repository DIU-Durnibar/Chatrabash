using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[AllowAnonymous]
public class SaaSController : BaseController
{
    private readonly AppDbContext _context;

    public SaaSController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("packages")]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _context.SubscriptionPackages.ToListAsync();
        return SuccessResponse("Packages loaded successfully", packages);
    }
}