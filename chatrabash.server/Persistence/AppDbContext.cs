using System;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Room> Rooms { get; set; } 
    public required DbSet<Hostel> Hostels { get; set; }
}
