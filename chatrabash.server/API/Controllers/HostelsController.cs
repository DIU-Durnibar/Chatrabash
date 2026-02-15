using System;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class HostelsController(AppDbContext context) : BaseController
{
    [AllowAnonymous] 
    [HttpGet]
    public async Task<ActionResult<List<Hostel>>> GetHostels()
    {
        var hostels = await context.Hostels
            .Select(h => new { h.Id, h.Name })
            .ToListAsync();

        return Ok(hostels);
    }

}
