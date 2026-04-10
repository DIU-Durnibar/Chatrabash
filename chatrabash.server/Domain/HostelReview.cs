namespace Domain;

public class HostelReview
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();
    public string UserId { get; set; } = string.Empty;
    public string HostelId { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
