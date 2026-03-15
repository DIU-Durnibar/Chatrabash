using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DbInitializer
{
    private static List<Room> _rooms = new List<Room>
    {
        new Room { RoomNumber = "G-101", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 0, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "101", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "301", FloorNo = 3, SeatCapacity = 1, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = true, IsActive = true }, 
        new Room { RoomNumber = "302", FloorNo = 3, SeatCapacity = 2, SeatAvailable = 0, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = true, IsActive = true }
    };

    public static async Task SeedData(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        if (!roleManager.Roles.Any())
        {
            await roleManager.CreateAsync(new IdentityRole("Manager"));
            await roleManager.CreateAsync(new IdentityRole("Boarder"));
        }

        var hostel1Id = "h1-guid-hostel-1";
        var hostel2Id = "h2-guid-hostel-2";
        var khaledId = Guid.NewGuid().ToString();

        if (!context.Hostels.Any())
        {
            var hostels = new List<Hostel>
            {
                new Hostel { Id = hostel1Id, Name = "Chatrabash Super Hostel" },
                new Hostel { Id = hostel2Id, Name = "Padma Student Home" },
                new Hostel { Id = "h3-guid", Name = "Rajshahi Model Mess" }
            };

            await context.Hostels.AddRangeAsync(hostels);
            await context.SaveChangesAsync();
        }

        if (!userManager.Users.Any())
        {
            var users = new List<User>
            {
                new User { 
                    Id = khaledId,
                    DisplayName = "Khaled", 
                    UserName = "khaled@test.com", 
                    Email = "khaled@test.com",
                    PhoneNumber = "01711000001",
                    HostelId = hostel1Id, 
                    IsApproved = true 
                },
                new User { 
                    DisplayName = "Tufan", 
                    UserName = "tufan@test.com", 
                    Email = "tufan@test.com",
                    PhoneNumber = "01811000002",
                    HostelId = hostel1Id,
                    IsApproved = true 
                },
                new User { 
                    DisplayName = "Mojid", 
                    UserName = "mojid@test.com", 
                    Email = "mojid@test.com",
                    PhoneNumber = "01911000003",
                    HostelId = hostel2Id, 
                    IsApproved = false 
                }
            };

            foreach (var user in users)
            {
                var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                if (result.Succeeded)
                {
                    if (user.Email == "mojid@test.com")
                        await userManager.AddToRoleAsync(user, "Boarder");
                    else
                        await userManager.AddToRoleAsync(user, "Manager");
                }
            }

            var hostel1 = await context.Hostels.FindAsync(hostel1Id);
            if (hostel1 != null)
            {
                hostel1.ManagerId = khaledId;
                await context.SaveChangesAsync();
            }
        }

        if (!context.Rooms.Any())
        {
            foreach (var room in _rooms)
            {
                room.HostelId = hostel1Id;
            }
            await context.Rooms.AddRangeAsync(_rooms);
            await context.SaveChangesAsync();
        }
    }
}