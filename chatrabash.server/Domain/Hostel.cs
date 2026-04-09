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

    public int? SubscriptionPackageId { get; set; }
    public SubscriptionPackage? SubscriptionPackage { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<HostelPhoto> Photos { get; set; } = new List<HostelPhoto>();

    public ICollection<Room> Rooms { get; set; } = new List<Room>();

    public double Rating { get; set; } = 4.5;
    public int ReviewCount { get; set; } = 0;
    public bool IsFeatured { get; set; } = false;
}  