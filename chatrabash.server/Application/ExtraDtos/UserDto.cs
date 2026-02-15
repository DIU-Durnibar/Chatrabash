using System;

namespace Application.ExtraDtos;

public class UserDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string HostelId {get; set;} = string.Empty;
}
