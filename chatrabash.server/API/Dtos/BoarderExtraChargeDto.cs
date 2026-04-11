using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class BoarderExtraChargeDto
{
    [Range(1, 12)]
    public int Month { get; set; }

    public int Year { get; set; }

    public decimal Amount { get; set; }
}
