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

    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoomById([FromRoute] string id)
    {
        var room = await context.Rooms.FindAsync(id);
        if(room == null) return BadRequest();

        return Ok(room);
    }

    [HttpPost]
    public async Task<ActionResult> CreateRoom([FromBody] Room room)
    {
        if(room == null) return BadRequest();
        context.Add(room);
        await context.SaveChangesAsync();
        return Ok(room.Id); 
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteRoomById([FromRoute] string id)
    {
        var room = await context.Rooms.FindAsync(id);
        if(room == null) return NotFound();
        
        context.Rooms.Remove(room);
        await context.SaveChangesAsync();
        return Ok("Deleted: " + id);
    }

}
