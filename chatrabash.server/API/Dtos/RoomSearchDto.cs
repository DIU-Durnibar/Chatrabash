namespace API.DTOs;

public class RoomSearchDto
{
    public string? HostelId { get; set; } 
    public int? SeatCapacity { get; set; }
    public bool? IsAcAvailable { get; set; }
    public int? IsAttachedBathroomAvailable { get; set; }
    public int? IsBalconyAvailable { get; set; }
}