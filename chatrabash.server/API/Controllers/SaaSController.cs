using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using API.DTOs;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers;

[AllowAnonymous]
public class SaaSController : BaseController
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;

    public SaaSController(AppDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("packages")]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _context.SubscriptionPackages.ToListAsync();
        return SuccessResponse("Packages loaded successfully", packages);
    }

    [HttpPost("register-hostel")]
    public async Task<IActionResult> RegisterHostel([FromBody] RegisterHostelDto dto)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == dto.ManagerEmail))
            return ErrorResponse("This email is already registered.");

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var newHostel = new Hostel
            {
                Name = dto.HostelName,
                AreaDescription = dto.AreaDescription,
                DivisionId = dto.DivisionId,
                DistrictId = dto.DistrictId,
                UpazilaId = dto.UpazilaId,
                SubscriptionPackageId = dto.SubscriptionPackageId,
                IsActive = true 
            };

            _context.Hostels.Add(newHostel);
            await _context.SaveChangesAsync(); 

    
            var managerUser = new User
            {
                DisplayName = dto.ManagerName,
                UserName = dto.ManagerEmail,
                PhoneNumber = dto.ManagerPhone,
                HostelId = newHostel.Id, 
                IsApproved = true 
            };

            var result = await _userManager.CreateAsync(managerUser, dto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return ErrorResponse($"User creation failed: {errors}");
            }

         
            await _userManager.AddToRoleAsync(managerUser, "Manager");

           
            newHostel.ManagerId = managerUser.Id;
            await _context.SaveChangesAsync();

            
            await transaction.CommitAsync();

            return SuccessResponse("Hostel and Manager account registered successfully! You can now log in.");
        }
        catch (Exception ex)
        {
       
            await transaction.RollbackAsync();
            return ErrorResponse($"An error occurred during registration: {ex.Message}");
        }
    }
}