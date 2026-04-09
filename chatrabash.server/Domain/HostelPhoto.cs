namespace Domain;

public class HostelPhoto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Url { get; set; } = string.Empty; 
    public bool IsMain { get; set; } 
    public string HostelId { get; set; } = string.Empty;
    public Hostel? Hostel { get; set; }
}