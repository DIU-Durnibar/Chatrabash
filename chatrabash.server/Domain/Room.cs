using System;

namespace Domain;

public class Room
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();

    public string RoomNumber { get; set; } = "Unknown"; 

    public string? HostelId { get; set; } 
    public Hostel? Hostel { get; set; }

    public int FloorNo { get; set; }

    public int SeatCapacity { get; set; } 

    public int SeatAvailable { get; set; }

    public bool IsAttachedBathroomAvailable {get; set;}

    public bool IsBalconyAvailable {get; set;}

    public bool IsAcAvailable { get; set; } 

    public bool IsActive { get; set; } = true; 
        
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Per-seat monthly room hire (ভাড়া) — used for billing seat rent.</summary>
    public decimal MonthlyRent { get; set; }

    /// <summary>Optional total living cost estimate (ভাড়া+খাবার+অন্যান্য) for marketing; falls back to MonthlyRent in UI when null.</summary>
    public decimal? EstimatedMonthlyCost { get; set; }
}
