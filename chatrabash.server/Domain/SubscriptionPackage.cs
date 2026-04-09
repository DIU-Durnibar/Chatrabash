namespace Domain;

public class SubscriptionPackage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public int MaxBoarders { get; set; }
    public string Features { get; set; } = string.Empty; 
}