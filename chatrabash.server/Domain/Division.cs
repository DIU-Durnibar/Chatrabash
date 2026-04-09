namespace Domain;

public class Division
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BengaliName { get; set; } = string.Empty;

    public ICollection<District> Districts { get; set; } = new List<District>();
}