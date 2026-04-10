namespace API.DTOs;

public class MockManagerPlatformPaymentDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string PaymentMethod { get; set; } = "MockCard";
}
