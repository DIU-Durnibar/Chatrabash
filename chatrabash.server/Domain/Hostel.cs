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
    public int? DivisionId { get; set; }
    public int? DistrictId { get; set; }
    public int? UpazilaId { get; set; }
    public string AreaDescription { get; set; } = string.Empty;

    public Division? Division { get; set; }
    public District? District { get; set; }
    public Upazila? Upazila { get; set; }
}  