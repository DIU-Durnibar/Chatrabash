namespace Domain;

public class Upazila
{
    public int Id { get; set; }
    public int DistrictId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BengaliName { get; set; } = string.Empty;

    // Navigation property
    public District? District { get; set; }
}