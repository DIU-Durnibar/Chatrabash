using System;

namespace Domain;

public class Hostel
{
    public string Id { get; set; } = Guid.CreateVersion7().ToString();
    public string Name { get; set; } = string.Empty;
   
}  