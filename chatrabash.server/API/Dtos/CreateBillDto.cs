namespace API.DTOs;

public class CreateBillDto
{
    public string UserId { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal SeatRent { get; set; }
    public decimal UtilityCharge { get; set; }
    public decimal AdditionalCharge { get; set; }
    public decimal MealCharge { get; set; } 
}