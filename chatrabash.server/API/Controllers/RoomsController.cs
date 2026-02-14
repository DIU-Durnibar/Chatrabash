using System;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;
using Application.Rooms.Queries;
using Application.Rooms.Dtos;
using Application.Rooms.Commands;

namespace API.Controllers;

public class RoomsController (AppDbContext context) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<List<GetAllRoomsDto>>> GetAllRoom()
    {
        return Ok(await Mediator.Send(new GetAllRooms.Query()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoomById([FromRoute] string id)
    {
        var room = await context.Rooms.FindAsync(id);
        if(room == null) return BadRequest();

        return Ok(room);
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateNewRoom([FromBody]Create.Command command) 
    {
        return Ok(await Mediator.Send(command));
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteRoomById([FromQuery]string id)
    {
        var room = await context.Rooms.FindAsync(id);
        if(room == null) return NotFound();
        
        context.Rooms.Remove(room);
        await context.SaveChangesAsync();
        return Ok("Deleted: " + id);
    }

}
