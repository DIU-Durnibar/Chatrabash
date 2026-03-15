using System;

namespace Domain;

public class PaymentRecord
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();

    public string MonthlyBillId { get; set; } = string.Empty;
    public MonthlyBill? MonthlyBill { get; set; }

    public string UserId { get; set; } = string.Empty;
    public User? User { get; set; }

    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    
    public string PaymentMethod { get; set; } = "Cash"; 
    
    public string? TransactionId { get; set; } 
    public string ReceivedByManagerId { get; set; } = string.Empty;
}