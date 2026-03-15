namespace API.DTOs;

public class RoomSearchDto
{
    public string? HostelId { get; set; } 
    public int? SeatCapacity { get; set; }
    public bool? IsAcAvailable { get; set; }
    public bool? IsAttachedBathroomAvailable { get; set; }
    public bool? IsBalconyAvailable { get; set; }
}