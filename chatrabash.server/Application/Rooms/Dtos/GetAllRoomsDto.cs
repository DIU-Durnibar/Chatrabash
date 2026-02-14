using System;

namespace Application.Rooms.Dtos;

public class GetAllRoomsDto
{
    public required string Id { get; set; }

    public string RoomNumber { get; set; } = string.Empty; 

    public int FloorNo { get; set; }

    public int SeatCapacity { get; set; } 

    public int SeatAvailable { get; set; }

    public int IsAttachedBathroomAvailable {get; set;}

    public int IsBalconyAvailable {get; set;}

    public bool IsAcAvailable { get; set; } 

}
