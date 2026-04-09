namespace API.DTOs;

public class HostelSearchDto
{
    public int? DivisionId { get; set; }
    public int? DistrictId { get; set; }
    public int? UpazilaId { get; set; }
    
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    
    public bool? HasAc { get; set; }
    public bool? HasAttachedBath { get; set; }
}