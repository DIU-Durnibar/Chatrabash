using System;

namespace Domain;

public class MonthlyBill
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();

    public string UserId { get; set; } = string.Empty;
    public User? User { get; set; }

    public string HostelId { get; set; } = string.Empty;
    public Hostel? Hostel { get; set; }

    public int Month { get; set; } 
    public int Year { get; set; } 

    public decimal SeatRent { get; set; }
    public decimal MealCharge { get; set; }
    public decimal UtilityCharge { get; set; }
    public decimal AdditionalCharge { get; set; } 
    public decimal TotalAmount { get; set; } 
    public decimal PaidAmount { get; set; } = 0;
    
    public string Status { get; set; } = "Unpaid"; 

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; } 
    public ICollection<PaymentRecord> PaymentRecords { get; set; } = new List<PaymentRecord>();
}