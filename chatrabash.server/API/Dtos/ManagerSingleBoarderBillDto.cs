namespace API.DTOs;

public class ManagerSingleBoarderBillDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal UtilityCharge { get; set; }
    public decimal AdditionalCharge { get; set; }
}
