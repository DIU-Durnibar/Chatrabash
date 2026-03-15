using System;
using Application.ExtraDtos; 
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Services; 

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
        if (hostel == null) return BadRequest("Invalid Hostel Selected");

        if (await _signInManager.UserManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
        {
             return BadRequest("Username is already taken");
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
            return Ok("Registration successful! Please wait for Hostel Manager's approval.");
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }

        return ValidationProblem();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _signInManager.UserManager.FindByEmailAsync(loginDto.Email);

        if (user == null) return Unauthorized("Invalid email");

        if (!user.IsApproved) 
        {
            return Unauthorized("Account not approved yet. Contact your Hostel Manager.");
        }

        var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, isPersistent: true, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName ?? "",
                Email = user.Email ?? "",
                UserName = user.UserName ?? "",
                HostelId = user.HostelId ?? "",
                Token = await _tokenService.CreateToken(user) 
            };
        }

        return Unauthorized("Invalid password");
    }

    [AllowAnonymous]
    [HttpGet("check-username")]
    public async Task<ActionResult<bool>> CheckUsername([FromQuery] string username)
    {
        var user = await _signInManager.UserManager.FindByNameAsync(username);
        return Ok(user == null); 
    }
}