namespace Domain;

public class ActivityLog
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? ActorUserId { get; set; }
    public string? ActorEmail { get; set; }
    public string ActorRole { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? TargetUserId { get; set; }
    public string? HostelId { get; set; }
    public string? Details { get; set; }
}
