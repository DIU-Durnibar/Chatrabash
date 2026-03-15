using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Persistence;
using System.Linq;
using System.Threading.Tasks;

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
}