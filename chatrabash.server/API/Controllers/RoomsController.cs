using System;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class RoomsController (AppDbContext context) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<List<Room>>> GetAllRoom()
    {
        var rooms = await context.Rooms.ToListAsync();
        return Ok(rooms);
    }
}
