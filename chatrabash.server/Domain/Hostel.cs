using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public class Hostel
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();
    public string Name { get; set; } = string.Empty;
    
    public string? ManagerId { get; set; }

    [ForeignKey("ManagerId")]
    public User? Manager { get; set; }
}  