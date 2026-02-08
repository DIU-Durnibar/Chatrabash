using System;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : DbContext (options)
{
    public required DbSet<Room> Rooms { get; set; } 
}
