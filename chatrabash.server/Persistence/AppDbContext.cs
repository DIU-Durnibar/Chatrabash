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
    public DbSet<MonthlyBill> MonthlyBills { get; set; }
    public DbSet<PaymentRecord> PaymentRecords { get; set; }
    public DbSet<Division> Divisions { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<Upazila> Upazilas { get; set; }
    public DbSet<SubscriptionPackage> SubscriptionPackages { get; set; }
    public DbSet<HostelPhoto> HostelPhotos { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<HostelReview> HostelReviews { get; set; }
    public DbSet<ManagerPlatformPayment> ManagerPlatformPayments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<HostelReview>()
            .HasIndex(r => new { r.UserId, r.HostelId })
            .IsUnique();
    }
}
