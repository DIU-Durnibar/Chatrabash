namespace API.DTOs;

public class MakePaymentDto
{
    public string BillId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "Cash";    
    public string? TransactionId { get; set; } 
}