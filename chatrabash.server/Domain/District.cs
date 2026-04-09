namespace Domain;

public class District
{
    public int Id { get; set; }
    public int DivisionId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BengaliName { get; set; } = string.Empty;

    // Navigation properties
    public Division? Division { get; set; }
    public ICollection<Upazila> Upazilas { get; set; } = new List<Upazila>();
}