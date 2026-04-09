using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[AllowAnonymous] // Public access so users can search and register
public class LocationController : BaseController
{
    private readonly AppDbContext _context;

    public LocationController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("divisions")]
    public async Task<IActionResult> GetDivisions()
    {
        var divisions = await _context.Divisions
            .OrderBy(d => d.Name)
            .Select(d => new { d.Id, d.Name, d.BengaliName })
            .ToListAsync();

        return SuccessResponse("Divisions fetched successfully.", divisions);
    }

    [HttpGet("districts/{divisionId}")]
    public async Task<IActionResult> GetDistricts(int divisionId)
    {
        var districts = await _context.Districts
            .Where(d => d.DivisionId == divisionId)
            .OrderBy(d => d.Name)
            .Select(d => new { d.Id, d.Name, d.BengaliName })
            .ToListAsync();

        return SuccessResponse("Districts fetched successfully.", districts);
    }

    [HttpGet("upazilas/{districtId}")]
    public async Task<IActionResult> GetUpazilas(int districtId)
    {
        var upazilas = await _context.Upazilas
            .Where(u => u.DistrictId == districtId)
            .OrderBy(u => u.Name)
            .Select(u => new { u.Id, u.Name, u.BengaliName })
            .ToListAsync();

        return SuccessResponse("Upazilas fetched successfully.", upazilas);
    }
}