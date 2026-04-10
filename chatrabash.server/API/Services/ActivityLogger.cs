using Domain;
using Persistence;

namespace API.Services;

public class ActivityLogger
{
    private readonly AppDbContext _db;

    public ActivityLogger(AppDbContext db)
    {
        _db = db;
    }

    public async Task LogAsync(
        string? actorUserId,
        string? actorEmail,
        string actorRole,
        string action,
        string category,
        string? hostelId = null,
        string? targetUserId = null,
        string? details = null)
    {
        _db.ActivityLogs.Add(new ActivityLog
        {
            ActorUserId = actorUserId,
            ActorEmail = actorEmail,
            ActorRole = actorRole,
            Action = action,
            Category = category,
            HostelId = hostelId,
            TargetUserId = targetUserId,
            Details = details
        });
        await _db.SaveChangesAsync();
    }
}
