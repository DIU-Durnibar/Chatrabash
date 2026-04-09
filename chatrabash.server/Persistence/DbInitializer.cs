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
        new Room { RoomNumber = "G-101", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 0, IsAttachedBathroomAvailable = false, IsBalconyAvailable = true, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "101", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 1, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "301", FloorNo = 3, SeatCapacity = 1, SeatAvailable = 1, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = true, IsActive = true }, 
        new Room { RoomNumber = "302", FloorNo = 3, SeatCapacity = 2, SeatAvailable = 0, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = true, IsActive = true }
    };

    public static async Task SeedData(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Roles Seed (SuperAdmin যুক্ত করা হলো)
        if (!roleManager.Roles.Any())
        {
            await roleManager.CreateAsync(new IdentityRole("Manager"));
            await roleManager.CreateAsync(new IdentityRole("Boarder"));
            await roleManager.CreateAsync(new IdentityRole("SuperAdmin")); 
        }

        // 2. Subscription Packages Seed
        if (!context.SubscriptionPackages.Any())
        {
            var packages = new List<SubscriptionPackage>
            {
                new SubscriptionPackage { Name = "স্টার্টার (Starter)", MonthlyPrice = 0, MaxBoarders = 50, Features = "বেসিক হিসাব-নিকাশ, ইমেইল সাপোর্ট" },
                new SubscriptionPackage { Name = "প্রফেশনাল (Professional)", MonthlyPrice = 1000, MaxBoarders = 200, Features = "অ্যাডভান্সড অ্যানালিটিক্স, এসএমএস অ্যালার্ট, প্রায়োরিটি সাপোর্ট" },
                new SubscriptionPackage { Name = "এন্টারপ্রাইজ (Enterprise)", MonthlyPrice = 3000, MaxBoarders = 1000, Features = "আনলিমিটেড বোর্ডার, কাস্টম ডোমেইন, ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার" }
            };
            await context.SubscriptionPackages.AddRangeAsync(packages);
            await context.SaveChangesAsync();
        }

        // 3. Locations Seed (বিভাগ, জেলা, উপজেলা)
        if (!context.Divisions.Any())
        {
            var dhakaDiv = new Division { Name = "Dhaka", BengaliName = "ঢাকা" };
            var rajshahiDiv = new Division { Name = "Rajshahi", BengaliName = "রাজশাহী" };
            
            await context.Divisions.AddRangeAsync(dhakaDiv, rajshahiDiv);
            await context.SaveChangesAsync();

            var dhakaDist = new District { Name = "Dhaka", BengaliName = "ঢাকা", DivisionId = dhakaDiv.Id };
            var rajshahiDist = new District { Name = "Rajshahi", BengaliName = "রাজশাহী", DivisionId = rajshahiDiv.Id };
            
            await context.Districts.AddRangeAsync(dhakaDist, rajshahiDist);
            await context.SaveChangesAsync();

            var dhanmondi = new Upazila { Name = "Dhanmondi", BengaliName = "ধানমন্ডি", DistrictId = dhakaDist.Id };
            var mirpur = new Upazila { Name = "Mirpur", BengaliName = "মিরপুর", DistrictId = dhakaDist.Id };
            var boalia = new Upazila { Name = "Boalia", BengaliName = "বোয়ালিয়া", DistrictId = rajshahiDist.Id };
            
            await context.Upazilas.AddRangeAsync(dhanmondi, mirpur, boalia);
            await context.SaveChangesAsync();
        }

        var hostel1Id = "h1-guid-hostel-1";
        var hostel2Id = "h2-guid-hostel-2";
        var khaledId = Guid.NewGuid().ToString();

        // 4. Hostels Seed (নতুন ফিল্ডগুলোর সাথে)
        if (!context.Hostels.Any())
        {
            var proPackage = await context.SubscriptionPackages.FirstOrDefaultAsync(p => p.Name.Contains("Professional"));
            var starterPackage = await context.SubscriptionPackages.FirstOrDefaultAsync(p => p.Name.Contains("Starter"));
            var dhanmondiLoc = await context.Upazilas.FirstOrDefaultAsync(u => u.Name == "Dhanmondi");

            var hostels = new List<Hostel>
            {
                new Hostel { 
                    Id = hostel1Id, 
                    Name = "Chatrabash Super Hostel",
                    SubscriptionPackageId = proPackage?.Id,
                    DivisionId = dhanmondiLoc?.District?.DivisionId,
                    DistrictId = dhanmondiLoc?.DistrictId,
                    UpazilaId = dhanmondiLoc?.Id,
                    AreaDescription = "রোড নং ৪, ধানমন্ডি",
                    IsActive = true,
                    IsFeatured = true
                },
                new Hostel { 
                    Id = hostel2Id, 
                    Name = "Padma Student Home",
                    SubscriptionPackageId = starterPackage?.Id,
                    IsActive = true,
                    IsFeatured = true
                },
                new Hostel { 
                    Id = "h3-guid", 
                    Name = "Rajshahi Model Mess",
                    SubscriptionPackageId = starterPackage?.Id,
                    IsActive = true,
                    IsFeatured = true
                }
            };

            await context.Hostels.AddRangeAsync(hostels);
            await context.SaveChangesAsync();
        }

        // 5. Users Seed
        if (!userManager.Users.Any())
        {
            var users = new List<User>
            {
                // Super Admin
                new User { 
                    DisplayName = "Hasib Admin", 
                    UserName = "admin@chatrabash.com", 
                    Email = "admin@chatrabash.com",
                    IsApproved = true 
                },
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
                    if (user.Email == "admin@chatrabash.com")
                        await userManager.AddToRoleAsync(user, "SuperAdmin");
                    else if (user.Email == "mojid@test.com")
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

        // 6. Rooms Seed
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