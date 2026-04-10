namespace Application.ExtraDtos;

public class UserDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string HostelId { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty; 
    public string ProfilePictureUrl { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
    public string? Institution { get; set; }
    public string? BloodGroup { get; set; }
    public string? EmergencyContact { get; set; }
    public string? Gender { get; set; }
}