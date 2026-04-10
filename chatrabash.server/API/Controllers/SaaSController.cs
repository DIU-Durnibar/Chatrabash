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
    private readonly API.Services.ActivityLogger _activity;

    public SaaSController(AppDbContext context, UserManager<User> userManager, API.Services.ActivityLogger activity)
    {
        _context = context;
        _userManager = userManager;
        _activity = activity;
    }

    [HttpGet("packages")]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _context.SubscriptionPackages.ToListAsync();
        return SuccessResponse("Packages loaded successfully", packages);
    }

    public class MockPackagePayDto
    {
        public int PackageId { get; set; }
    }

    /// <summary>Fake payment gateway — returns a transaction id to send with register-hostel for paid packages.</summary>
    [HttpPost("mock-pay-package")]
    public async Task<IActionResult> MockPayPackage([FromBody] MockPackagePayDto dto)
    {
        var pkg = await _context.SubscriptionPackages.FindAsync(dto.PackageId);
        if (pkg == null) return ErrorResponse("Package not found.");
        var trx = "MOCK_PKG_" + Guid.NewGuid().ToString("N")[..12].ToUpperInvariant();
        await _activity.LogAsync(null, null, "Anonymous", "MockPackagePayment", "Payment",
            null, null, $"packageId={dto.PackageId},amount={pkg.MonthlyPrice},trx={trx}");
        return SuccessResponse("Mock payment successful.", new { transactionId = trx, amount = pkg.MonthlyPrice, packageId = dto.PackageId });
    }

    [HttpPost("register-hostel")]
    public async Task<IActionResult> RegisterHostel([FromBody] RegisterHostelDto dto)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == dto.ManagerEmail))
            return ErrorResponse("This email is already registered.");

        var selectedPackage = await _context.SubscriptionPackages.FindAsync(dto.SubscriptionPackageId);
        if (selectedPackage == null) return ErrorResponse("Invalid subscription package.");

        if (selectedPackage.MonthlyPrice > 0)
        {
            if (string.IsNullOrWhiteSpace(dto.PackagePaymentTransactionId))
                return ErrorResponse("Paid packages require completing mock payment (PackagePaymentTransactionId).");
        }

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
                Email = dto.ManagerEmail,
                PhoneNumber = dto.ManagerPhone,
                HostelId = newHostel.Id, 
                IsApproved = true,
                ProfilePictureUrl = "/default-avatar.svg"
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

            await _activity.LogAsync(managerUser.Id, managerUser.Email, "Manager", "HostelRegistered", "Hostel",
                newHostel.Id, null,
                $"hostel={newHostel.Name},packagePayment={dto.PackagePaymentTransactionId ?? "N/A"}");

            return SuccessResponse("Hostel and Manager account registered successfully! You can now log in.");
        }
        catch (Exception ex)
        {
       
            await transaction.RollbackAsync();
            return ErrorResponse($"An error occurred during registration: {ex.Message}");
        }
    }
}