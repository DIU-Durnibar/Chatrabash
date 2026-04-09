namespace API.DTOs;

public class RegisterHostelDto
{
    public string HostelName { get; set; } = string.Empty;
    public string AreaDescription { get; set; } = string.Empty;
    public int DivisionId { get; set; }
    public int DistrictId { get; set; }
    public int UpazilaId { get; set; }
    public int SubscriptionPackageId { get; set; }

    public string ManagerName { get; set; } = string.Empty;
    public string ManagerEmail { get; set; } = string.Empty;
    public string ManagerPhone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}