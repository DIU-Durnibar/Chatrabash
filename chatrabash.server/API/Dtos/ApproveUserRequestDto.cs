using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ApproveUserRequestDto
{
    [Required]
    public string AllocatedRoomId { get; set; } = string.Empty;
}
