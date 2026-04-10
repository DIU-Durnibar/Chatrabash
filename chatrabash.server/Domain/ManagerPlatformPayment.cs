namespace Domain;

public class ManagerPlatformPayment
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();
    public string HostelId { get; set; } = string.Empty;
    public string ManagerUserId { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Amount { get; set; }
    public int? SubscriptionPackageId { get; set; }
    public string Status { get; set; } = "Paid";
    public string PaymentMethod { get; set; } = "MockGateway";
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
