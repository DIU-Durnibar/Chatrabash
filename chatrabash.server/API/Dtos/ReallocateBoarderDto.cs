using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ReallocateBoarderDto
{
    [Required]
    public string NewRoomId { get; set; } = string.Empty;
}
