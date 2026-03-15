namespace API.DTOs;

public class RoomDto
{
    public string? RoomNumber { get; set; }
    public int FloorNo { get; set; }
    public int SeatCapacity { get; set; }
    public bool IsAttachedBathroomAvailable { get; set; }
    public bool IsBalconyAvailable { get; set; }
    public bool IsAcAvailable { get; set; }
    public bool IsActive { get; set; }
    public decimal MonthlyRent { get; set; }
}