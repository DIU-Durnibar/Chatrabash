using System;
using Application.ExtraDtos; 
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Services; 
using Microsoft.AspNetCore.Http; 

namespace API.Controllers;

public class AccountController : BaseController
{
    private readonly SignInManager<User> _signInManager;
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService; 

    public AccountController(SignInManager<User> signInManager, AppDbContext context, TokenService tokenService)
    {
        _signInManager = signInManager;
        _context = context;
        _tokenService = tokenService; 
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

        var user = new User
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username, 
            HostelId = registerDto.HostelId, 
            IsApproved = false,
            PreferredRoomId = registerDto.PreferredRoomId,
            PreferenceNote = registerDto.PreferenceNote
        };

        var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            await _signInManager.UserManager.AddToRoleAsync(user, "Boarder");
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

        if (user == null) return ErrorResponse("Invalid email", StatusCodes.Status401Unauthorized);

        if (!user.IsApproved) 
        {
            return ErrorResponse("Account not approved yet. Contact your Hostel Manager.", StatusCodes.Status401Unauthorized);
        }

        var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, isPersistent: true, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var userDto = new UserDto
            {
                DisplayName = user.DisplayName ?? "",
                Email = user.Email ?? "",
                UserName = user.UserName ?? "",
                HostelId = user.HostelId ?? "",
                Token = await _tokenService.CreateToken(user) 
            };
            
            return SuccessResponse("Login successful", userDto);
        }

        return ErrorResponse("Invalid password", StatusCodes.Status401Unauthorized);
    }

    [AllowAnonymous]
    [HttpGet("check-username")]
    public async Task<ActionResult> CheckUsername([FromQuery] string username)
    {
        var user = await _signInManager.UserManager.FindByNameAsync(username);
        return SuccessResponse("Username check completed", new { isAvailable = user == null }); 
    }
}