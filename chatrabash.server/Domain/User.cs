using System;
using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string HostelId { get; set; } = string.Empty;
    public Hostel? Hostel { get; set; }
    public bool IsApproved { get; set; } = false;
    public string? PreferredRoomId { get; set; } 
    public string? PreferenceNote { get; set; }  
    public string? AllocatedRoomId { get; set; } 
    public string ProfilePictureUrl { get; set; } = string.Empty;

}

