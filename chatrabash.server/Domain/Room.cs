using System;

namespace Domain;

public class Room
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();

    public string RoomNumber { get; set; } = "Unknown"; 

    public int FloorNo { get; set; }

    public int SeatCapacity { get; set; } 

    public int SeatAvailable { get; set; }

    public int IsAttachedBathroomAvailable {get; set;}

    public int IsBalconyAvailable {get; set;}

    public bool IsAcAvailable { get; set; } 

    public bool IsActive { get; set; } = true; 
        
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedAt { get; set; } 
}
