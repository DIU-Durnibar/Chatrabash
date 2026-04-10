using Application.ExtraDtos;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Services;
using API.DTOs;
using System.Security.Claims;

namespace API.Controllers;

public class AccountController : BaseController
{
    private readonly SignInManager<User> _signInManager;
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService; 
    private readonly UserManager<User> _userManager;
    private readonly ActivityLogger _activity;

    public AccountController(SignInManager<User> signInManager, AppDbContext context, TokenService tokenService, UserManager<User> userManager, ActivityLogger activity)
    {
        _signInManager = signInManager;
        _context = context;
        _tokenService = tokenService; 
        _userManager = userManager;
        _activity = activity;
    }

    [AllowAnonymous] 
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var hostel = await _context.Hostels.FindAsync(registerDto.HostelId);
        if (hostel == null) return ErrorResponse("Invalid Hostel Selected");

        if (await _signInManager.UserManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
        {
             return ErrorResponse("Username is already taken");
        }

        var pic = string.IsNullOrWhiteSpace(registerDto.ProfilePictureUrl) ? "/default-avatar.svg" : registerDto.ProfilePictureUrl;
        var user = new User
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username, 
            HostelId = registerDto.HostelId, 
            IsApproved = false,
            PreferredRoomId = registerDto.PreferredRoomId,
            PreferenceNote = registerDto.PreferenceNote,
            ProfilePictureUrl = pic,
            Institution = registerDto.Institution,
            BloodGroup = registerDto.BloodGroup,
            EmergencyContact = registerDto.EmergencyContact,
            Gender = registerDto.Gender,
            PhoneNumber = registerDto.PhoneNumber
        };

        var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            await _signInManager.UserManager.AddToRoleAsync(user, "Boarder");
            await _activity.LogAsync(user.Id, user.Email, "Boarder", "BoarderRegistered", "Auth", registerDto.HostelId, user.Id, null);
            return SuccessResponse("Registration successful! Please wait for Hostel Manager's approval.");
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }

        return ValidationProblem();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        var user = await _signInManager.UserManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            await _activity.LogAsync(null, loginDto.Email, "Unknown", "LoginFailed", "Auth", null, null, "invalid email");
            return ErrorResponse("Invalid email", StatusCodes.Status401Unauthorized);
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            await _activity.LogAsync(user.Id, user.Email, "User", "LoginFailed", "Auth", user.HostelId, null, "bad password");
            return ErrorResponse("Invalid password", StatusCodes.Status401Unauthorized);
        }

        if (!user.IsApproved) 
            return ErrorResponse("Account not approved yet. Contact your Hostel Manager.", StatusCodes.Status401Unauthorized);

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "User";
        await _activity.LogAsync(user.Id, user.Email, primaryRole, "Login", "Auth", user.HostelId, null, null);

        var userDto = new UserDto
        {
            DisplayName = user.DisplayName ?? "",
            Email = user.Email ?? "",
            UserName = user.UserName ?? "",
            HostelId = user.HostelId ?? "",
            Token = await _tokenService.CreateToken(user), 
            ProfilePictureUrl = string.IsNullOrEmpty(user.ProfilePictureUrl) ? "/default-avatar.svg" : user.ProfilePictureUrl,
            PhoneNumber = user.PhoneNumber,
            Bio = user.Bio,
            Institution = user.Institution,
            BloodGroup = user.BloodGroup,
            EmergencyContact = user.EmergencyContact,
            Gender = user.Gender
        };
        
        return SuccessResponse("Login successful", userDto);
    }

    [AllowAnonymous]
    [HttpGet("check-username")]
    public async Task<ActionResult> CheckUsername([FromQuery] string username)
    {
        var user = await _signInManager.UserManager.FindByNameAsync(username);
        return SuccessResponse("Username check completed", new { isAvailable = user == null }); 
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null) return ErrorResponse("User not found.", StatusCodes.Status404NotFound);
        return SuccessResponse("Profile loaded.", new
        {
            user.Id,
            user.DisplayName,
            user.Email,
            user.UserName,
            user.PhoneNumber,
            user.HostelId,
            ProfilePictureUrl = string.IsNullOrEmpty(user.ProfilePictureUrl) ? "/default-avatar.svg" : user.ProfilePictureUrl,
            user.Bio,
            user.Institution,
            user.BloodGroup,
            user.EmergencyContact,
            user.Gender
        });
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user == null) return ErrorResponse("User not found.", StatusCodes.Status404NotFound);

        if (!string.IsNullOrWhiteSpace(dto.DisplayName)) user.DisplayName = dto.DisplayName;
        if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.Institution != null) user.Institution = dto.Institution;
        if (dto.BloodGroup != null) user.BloodGroup = dto.BloodGroup;
        if (dto.EmergencyContact != null) user.EmergencyContact = dto.EmergencyContact;
        if (dto.Gender != null) user.Gender = dto.Gender;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "User";
        await _userManager.UpdateAsync(user);
        await _activity.LogAsync(user.Id, user.Email, role, "ProfileUpdated", "Profile", user.HostelId, null, null);
        return SuccessResponse("Profile updated.");
    }

    [Authorize] 
    [HttpPost("upload-photo")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        if (file == null || file.Length == 0) 
            return ErrorResponse("কোনো ছবি সিলেক্ট করা হয়নি!");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
            return ErrorResponse("শুধুমাত্র JPG, JPEG অথবা PNG ফাইল আপলোড করা যাবে।");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return ErrorResponse("ইউজার খুঁজে পাওয়া যায়নি।");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "users");
        if (!Directory.Exists(uploadsFolder)) 
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{userId}_{Guid.NewGuid().ToString().Substring(0, 8)}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
        {
            var oldFileName = Path.GetFileName(user.ProfilePictureUrl);
            var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
            if (System.IO.File.Exists(oldFilePath))
            {
                System.IO.File.Delete(oldFilePath);
            }
        }

        user.ProfilePictureUrl = $"/uploads/users/{uniqueFileName}";
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded) 
            return ErrorResponse("ডেটাবেস আপডেট করতে সমস্যা হয়েছে।");

        return SuccessResponse("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে।", new { 
            photoUrl = user.ProfilePictureUrl 
        });
    }

}