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
        new Room { RoomNumber = "G-101", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 0, MonthlyRent = 3200, EstimatedMonthlyCost = 6500, IsAttachedBathroomAvailable = false, IsBalconyAvailable = true, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "101", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 1, MonthlyRent = 4500, EstimatedMonthlyCost = 7800, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "301", FloorNo = 3, SeatCapacity = 1, SeatAvailable = 1, MonthlyRent = 6500, EstimatedMonthlyCost = 9500, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = true, IsActive = true },
        new Room { RoomNumber = "302", FloorNo = 3, SeatCapacity = 2, SeatAvailable = 0, MonthlyRent = 5500, EstimatedMonthlyCost = 8200, IsAttachedBathroomAvailable = true, IsBalconyAvailable = true, IsAcAvailable = true, IsActive = true }
    };

    public static async Task SeedData(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Roles Seed (SuperAdmin Added)
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

        // 3. Locations Seed 
        if (!context.Divisions.Any())
        {
            // --- Divisions ---
            var dhakaDiv = new Division { Name = "Dhaka", BengaliName = "ঢাকা" };
            var chattogramDiv = new Division { Name = "Chattogram", BengaliName = "চট্টগ্রাম" };
            var rajshahiDiv = new Division { Name = "Rajshahi", BengaliName = "রাজশাহী" };
            var khulnaDiv = new Division { Name = "Khulna", BengaliName = "খুলনা" };
            var barishalDiv = new Division { Name = "Barishal", BengaliName = "বরিশাল" };
            var sylhetDiv = new Division { Name = "Sylhet", BengaliName = "সিলেট" };
            var rangpurDiv = new Division { Name = "Rangpur", BengaliName = "রংপুর" };
            var mymensinghDiv = new Division { Name = "Mymensingh", BengaliName = "ময়মনসিংহ" };

            await context.Divisions.AddRangeAsync(dhakaDiv, chattogramDiv, rajshahiDiv, khulnaDiv, barishalDiv, sylhetDiv, rangpurDiv, mymensinghDiv);
            await context.SaveChangesAsync();

            // --- 20 Popular Districts ---
            // Dhaka Division
            var dhakaDist = new District { Name = "Dhaka", BengaliName = "ঢাকা", DivisionId = dhakaDiv.Id };
            var gazipurDist = new District { Name = "Gazipur", BengaliName = "গাজীপুর", DivisionId = dhakaDiv.Id };
            var narayanganjDist = new District { Name = "Narayanganj", BengaliName = "নারায়ণগঞ্জ", DivisionId = dhakaDiv.Id };
            var tangailDist = new District { Name = "Tangail", BengaliName = "টাঙ্গাইল", DivisionId = dhakaDiv.Id };
            
            // Chattogram Division
            var chattogramDist = new District { Name = "Chattogram", BengaliName = "চট্টগ্রাম", DivisionId = chattogramDiv.Id };
            var coxsBazarDist = new District { Name = "Cox's Bazar", BengaliName = "কক্সবাজার", DivisionId = chattogramDiv.Id };
            var cumillaDist = new District { Name = "Cumilla", BengaliName = "কুমিল্লা", DivisionId = chattogramDiv.Id };
            var noakhaliDist = new District { Name = "Noakhali", BengaliName = "নোয়াখালী", DivisionId = chattogramDiv.Id };

            // Rajshahi Division
            var rajshahiDist = new District { Name = "Rajshahi", BengaliName = "রাজশাহী", DivisionId = rajshahiDiv.Id };
            var boguraDist = new District { Name = "Bogura", BengaliName = "বগুড়া", DivisionId = rajshahiDiv.Id };
            var pabnaDist = new District { Name = "Pabna", BengaliName = "পাবনা", DivisionId = rajshahiDiv.Id };

            // Sylhet Division
            var sylhetDist = new District { Name = "Sylhet", BengaliName = "সিলেট", DivisionId = sylhetDiv.Id };
            var moulvibazarDist = new District { Name = "Moulvibazar", BengaliName = "মৌলভীবাজার", DivisionId = sylhetDiv.Id };

            // Khulna Division
            var khulnaDist = new District { Name = "Khulna", BengaliName = "খুলনা", DivisionId = khulnaDiv.Id };
            var jashoreDist = new District { Name = "Jashore", BengaliName = "যশোর", DivisionId = khulnaDiv.Id };

            // Barishal Division
            var barishalDist = new District { Name = "Barishal", BengaliName = "বরিশাল", DivisionId = barishalDiv.Id };

            // Rangpur Division
            var rangpurDist = new District { Name = "Rangpur", BengaliName = "রংপুর", DivisionId = rangpurDiv.Id };
            var dinajpurDist = new District { Name = "Dinajpur", BengaliName = "দিনাজপুর", DivisionId = rangpurDiv.Id };

            // Mymensingh Division
            var mymensinghDist = new District { Name = "Mymensingh", BengaliName = "ময়মনসিংহ", DivisionId = mymensinghDiv.Id };
            var jamalpurDist = new District { Name = "Jamalpur", BengaliName = "জামালপুর", DivisionId = mymensinghDiv.Id };

            await context.Districts.AddRangeAsync(
                dhakaDist, gazipurDist, narayanganjDist, tangailDist, 
                chattogramDist, coxsBazarDist, cumillaDist, noakhaliDist, 
                rajshahiDist, boguraDist, pabnaDist, 
                sylhetDist, moulvibazarDist, 
                khulnaDist, jashoreDist, barishalDist, 
                rangpurDist, dinajpurDist, mymensinghDist, jamalpurDist
            );
            await context.SaveChangesAsync();

            // --- Upazilas ---
            var upazilas = new List<Upazila>();

            // Dhaka (Popular Locations)
            upazilas.AddRange(new[] {
                new Upazila { Name = "Dhanmondi", BengaliName = "ধানমন্ডি", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Mirpur", BengaliName = "মিরপুর", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Gulshan", BengaliName = "গুলশান", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Banani", BengaliName = "বনানী", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Uttara", BengaliName = "উত্তরা", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Mohammadpur", BengaliName = "মোহাম্মদপুর", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Badda", BengaliName = "বাড্ডা", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Ashulia", BengaliName = "আশুলিয়া", DistrictId = dhakaDist.Id },
                new Upazila { Name = "Savar", BengaliName = "সাভার", DistrictId = dhakaDist.Id }
            });

            // Chattogram (Popular Locations)
            upazilas.AddRange(new[] {
                new Upazila { Name = "Kotwali", BengaliName = "কোতোয়ালী", DistrictId = chattogramDist.Id },
                new Upazila { Name = "Panchlaish", BengaliName = "পাঁচলাইশ", DistrictId = chattogramDist.Id },
                new Upazila { Name = "Pahartali", BengaliName = "পাহাড়তলী", DistrictId = chattogramDist.Id },
                new Upazila { Name = "Halishahar", BengaliName = "হালিশহর", DistrictId = chattogramDist.Id },
                new Upazila { Name = "Patenga", BengaliName = "পতেঙ্গা", DistrictId = chattogramDist.Id },
                new Upazila { Name = "Khulshi", BengaliName = "খুলশী", DistrictId = chattogramDist.Id }
            });

            // Rajshahi (Popular Locations)
            upazilas.AddRange(new[] {
                new Upazila { Name = "Boalia", BengaliName = "বোয়ালিয়া", DistrictId = rajshahiDist.Id },
                new Upazila { Name = "Rajpara", BengaliName = "রাজপাড়া", DistrictId = rajshahiDist.Id },
                new Upazila { Name = "Motihar", BengaliName = "মতিহার", DistrictId = rajshahiDist.Id },
                new Upazila { Name = "Shah Makhdum", BengaliName = "শাহ মখদুম", DistrictId = rajshahiDist.Id },
                new Upazila { Name = "Chandrima", BengaliName = "চন্দ্রিমা", DistrictId = rajshahiDist.Id }
            });

            // Bogura (Popular Locations)
            upazilas.AddRange(new[] {
                new Upazila { Name = "Bogura Sadar", BengaliName = "বগুড়া সদর", DistrictId = boguraDist.Id },
                new Upazila { Name = "Shibganj", BengaliName = "শিবগঞ্জ", DistrictId = boguraDist.Id },
                new Upazila { Name = "Sherpur", BengaliName = "শেরপুর", DistrictId = boguraDist.Id },
                new Upazila { Name = "Dhunat", BengaliName = "ধুনট", DistrictId = boguraDist.Id },
                new Upazila { Name = "Shajahanpur", BengaliName = "শাজাহানপুর", DistrictId = boguraDist.Id }
            });

            // Other Districts (Popular Upazilas)
            upazilas.AddRange(new[] {
                new Upazila { Name = "Gazipur Sadar", BengaliName = "গাজীপুর সদর", DistrictId = gazipurDist.Id },
                new Upazila { Name = "Tongi", BengaliName = "টঙ্গী", DistrictId = gazipurDist.Id },
                new Upazila { Name = "Narayanganj Sadar", BengaliName = "নারায়ণগঞ্জ সদর", DistrictId = narayanganjDist.Id },
                new Upazila { Name = "Tangail Sadar", BengaliName = "টাঙ্গাইল সদর", DistrictId = tangailDist.Id },
                new Upazila { Name = "Cox's Bazar Sadar", BengaliName = "কক্সবাজার সদর", DistrictId = coxsBazarDist.Id },
                new Upazila { Name = "Cumilla Adarsha Sadar", BengaliName = "কুমিল্লা আদর্শ সদর", DistrictId = cumillaDist.Id },
                new Upazila { Name = "Begumganj", BengaliName = "বেগমগঞ্জ", DistrictId = noakhaliDist.Id },
                new Upazila { Name = "Pabna Sadar", BengaliName = "পাবনা সদর", DistrictId = pabnaDist.Id },
                new Upazila { Name = "Sylhet Sadar", BengaliName = "সিলেট সদর", DistrictId = sylhetDist.Id },
                new Upazila { Name = "Sreemangal", BengaliName = "শ্রীমঙ্গল", DistrictId = moulvibazarDist.Id },
                new Upazila { Name = "Khulna Sadar", BengaliName = "খুলনা সদর", DistrictId = khulnaDist.Id },
                new Upazila { Name = "Jashore Sadar", BengaliName = "যশোর সদর", DistrictId = jashoreDist.Id },
                new Upazila { Name = "Barishal Sadar", BengaliName = "বরিশাল সদর", DistrictId = barishalDist.Id },
                new Upazila { Name = "Rangpur Sadar", BengaliName = "রংপুর সদর", DistrictId = rangpurDist.Id },
                new Upazila { Name = "Dinajpur Sadar", BengaliName = "দিনাজপুর সদর", DistrictId = dinajpurDist.Id },
                new Upazila { Name = "Mymensingh Sadar", BengaliName = "ময়মনসিংহ সদর", DistrictId = mymensinghDist.Id },
                new Upazila { Name = "Jamalpur Sadar", BengaliName = "জামালপুর সদর", DistrictId = jamalpurDist.Id }
            });

            await context.Upazilas.AddRangeAsync(upazilas);
            await context.SaveChangesAsync();
        }

        var hostel1Id = "h1-guid-hostel-1";
        var hostel2Id = "h2-guid-hostel-2";
        var khaledId = Guid.NewGuid().ToString();

        // 4. Hostels Seed 
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
                    IsApproved = true,
                    ProfilePictureUrl = "/default-avatar.svg"
                },
                new User { 
                    Id = khaledId,
                    DisplayName = "Khaled", 
                    UserName = "khaled@test.com", 
                    Email = "khaled@test.com",
                    PhoneNumber = "01711000001",
                    HostelId = hostel1Id, 
                    IsApproved = true,
                    ProfilePictureUrl = "/default-avatar.svg"
                },
                new User { 
                    DisplayName = "Tufan", 
                    UserName = "tufan@test.com", 
                    Email = "tufan@test.com",
                    PhoneNumber = "01811000002",
                    HostelId = hostel2Id,
                    IsApproved = true,
                    ProfilePictureUrl = "/default-avatar.svg"
                },
                new User { 
                    DisplayName = "Mojid", 
                    UserName = "mojid@test.com", 
                    Email = "mojid@test.com",
                    PhoneNumber = "01911000003",
                    HostelId = hostel2Id, 
                    IsApproved = false,
                    ProfilePictureUrl = "/default-avatar.svg"
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

            var tufanUser = await userManager.FindByEmailAsync("tufan@test.com");
            var hostel2 = await context.Hostels.FindAsync(hostel2Id);
            if (tufanUser != null && hostel2 != null)
            {
                hostel2.ManagerId = tufanUser.Id;
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

        await FixManagerAssignmentsAndProfiles(context, userManager, hostel1Id, hostel2Id);
        await SeedRichDemoData(context, userManager, hostel1Id, hostel2Id);
    }

    private static async Task FixManagerAssignmentsAndProfiles(AppDbContext context, UserManager<User> userManager,
        string hostel1Id, string hostel2Id)
    {
        var tufan = await userManager.FindByEmailAsync("tufan@test.com");
        if (tufan != null)
        {
            if (tufan.HostelId != hostel2Id)
            {
                tufan.HostelId = hostel2Id;
                await userManager.UpdateAsync(tufan);
            }
            var h2 = await context.Hostels.FindAsync(hostel2Id);
            if (h2 != null && h2.ManagerId != tufan.Id)
            {
                h2.ManagerId = tufan.Id;
                await context.SaveChangesAsync();
            }
        }

        var adminFix = await userManager.FindByEmailAsync("admin@chatrabash.com");
        if (adminFix != null && string.IsNullOrEmpty(adminFix.ProfilePictureUrl))
        {
            adminFix.ProfilePictureUrl = "/default-avatar.svg";
            await userManager.UpdateAsync(adminFix);
        }

        var khaled = await userManager.FindByEmailAsync("khaled@test.com");
        if (khaled != null && string.IsNullOrEmpty(khaled.ProfilePictureUrl))
        {
            khaled.ProfilePictureUrl = "/default-avatar.svg";
            await userManager.UpdateAsync(khaled);
        }

        var h1 = await context.Hostels.FindAsync(hostel1Id);
        if (h1 != null && khaled != null && h1.ManagerId != khaled.Id)
        {
            h1.ManagerId = khaled.Id;
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedRichDemoData(AppDbContext context, UserManager<User> userManager,
        string hostel1Id, string hostel2Id)
    {
        var room101 = await context.Rooms.FirstOrDefaultAsync(r => r.HostelId == hostel1Id && r.RoomNumber == "101");
        if (room101 == null) return;

        User? demo = await userManager.FindByEmailAsync("demo@chatrabash.local");
        if (demo == null)
        {
            demo = new User
            {
                DisplayName = "ডেমো বোর্ডার",
                UserName = "demo@chatrabash.local",
                Email = "demo@chatrabash.local",
                PhoneNumber = "01600000000",
                HostelId = hostel1Id,
                IsApproved = true,
                AllocatedRoomId = room101.Id,
                ProfilePictureUrl = "/default-avatar.svg",
                Institution = "ঢাকা বিশ্ববিদ্যালয়",
                BloodGroup = "B+",
                EmergencyContact = "01711112222",
                Gender = "Male"
            };
            var created = await userManager.CreateAsync(demo, "Demo@123");
            if (created.Succeeded)
                await userManager.AddToRoleAsync(demo, "Boarder");
            else
                return;
            if (room101.SeatAvailable > 0)
            {
                room101.SeatAvailable--;
                await context.SaveChangesAsync();
            }
        }

        demo = await userManager.FindByEmailAsync("demo@chatrabash.local");
        var khaled = await userManager.FindByEmailAsync("khaled@test.com");
        if (demo == null || khaled == null) return;

        if (!context.HostelPhotos.Any(p => p.HostelId == hostel1Id))
        {
            await context.HostelPhotos.AddRangeAsync(
                new HostelPhoto
                {
                    HostelId = hostel1Id,
                    IsMain = true,
                    Url = "https://images.unsplash.com/photo-1522708323300-5bd6081a3721?w=1200&q=80"
                },
                new HostelPhoto
                {
                    HostelId = hostel1Id,
                    IsMain = false,
                    Url = "https://images.unsplash.com/photo-1555854877-babc0c4c30b2?w=1200&q=80"
                });
            await context.SaveChangesAsync();
        }

        if (!await context.HostelReviews.AnyAsync(r => r.HostelId == hostel1Id && r.UserId == demo.Id))
        {
            context.HostelReviews.Add(new HostelReview
            {
                UserId = demo.Id,
                HostelId = hostel1Id,
                Rating = 5,
                Comment = "পরিষ্কার পরিচ্ছন্ন, ম্যানেজার সহায়ক। খুব ভালো অভিজ্ঞতা!",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            });
            await context.SaveChangesAsync();
        }

        var h = await context.Hostels.FindAsync(hostel1Id);
        if (h != null)
        {
            var revs = await context.HostelReviews.Where(r => r.HostelId == hostel1Id).ToListAsync();
            h.ReviewCount = revs.Count;
            h.Rating = revs.Count == 0 ? 4.5 : revs.Average(r => r.Rating);
            await context.SaveChangesAsync();
        }

        if (!context.ActivityLogs.Any() && khaled != null)
        {
            var logs = new List<ActivityLog>
            {
                new() { ActorEmail = "admin@chatrabash.com", ActorRole = "SuperAdmin", Action = "Seed", Category = "System", Details = "Initial activity log seed" },
                new() { ActorEmail = "khaled@test.com", ActorUserId = khaled.Id, ActorRole = "Manager", Action = "Login", Category = "Auth", HostelId = hostel1Id },
                new() { ActorEmail = demo.Email, ActorUserId = demo.Id, ActorRole = "Boarder", Action = "Login", Category = "Auth", HostelId = hostel1Id },
                new() { ActorEmail = demo.Email, ActorUserId = demo.Id, ActorRole = "Boarder", Action = "MockBillPayment", Category = "Payment", HostelId = hostel1Id, Details = "amount=2000" },
                new() { ActorEmail = "tufan@test.com", ActorRole = "Manager", Action = "RoomAdded", Category = "Room", HostelId = hostel2Id, Details = "201" }
            };
            await context.ActivityLogs.AddRangeAsync(logs);
            await context.SaveChangesAsync();
        }

        var tufan = await userManager.FindByEmailAsync("tufan@test.com");
        if (tufan != null && khaled != null && !context.ManagerPlatformPayments.Any(p => p.HostelId == hostel1Id))
        {
            var pkg = await context.Hostels.Where(x => x.Id == hostel1Id).Select(x => x.SubscriptionPackageId).FirstOrDefaultAsync();
            context.ManagerPlatformPayments.Add(new ManagerPlatformPayment
            {
                HostelId = hostel1Id,
                ManagerUserId = khaled.Id,
                Year = DateTime.UtcNow.Year,
                Month = DateTime.UtcNow.Month,
                Amount = 1000,
                SubscriptionPackageId = pkg,
                Status = "Paid",
                PaymentMethod = "MockCard",
                TransactionId = "MOCK_PLAT_SEED001"
            });
            await context.SaveChangesAsync();
        }

        if (!context.MonthlyBills.Any(b => b.UserId == demo.Id))
        {
            context.MonthlyBills.Add(new MonthlyBill
            {
                UserId = demo.Id,
                HostelId = hostel1Id,
                Month = DateTime.UtcNow.Month,
                Year = DateTime.UtcNow.Year,
                SeatRent = 5000,
                MealCharge = 2000,
                UtilityCharge = 500,
                AdditionalCharge = 0,
                TotalAmount = 7500,
                PaidAmount = 2000,
                Status = "Partial"
            });
            await context.SaveChangesAsync();
        }
    }
}