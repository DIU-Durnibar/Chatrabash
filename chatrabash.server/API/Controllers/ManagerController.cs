using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Persistence;
using API.DTOs;
using Microsoft.AspNetCore.Http;
using API.Services;

namespace API.Controllers;

[Authorize(Roles = "Manager")]
public class ManagerController : BaseController 
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;
    private readonly ActivityLogger _activity;

    public ManagerController(UserManager<User> userManager, AppDbContext context, ActivityLogger activity)
    {
        _userManager = userManager;
        _context = context;
        _activity = activity;
    }

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var pendingUsers = await _userManager.Users
            .Where(u => u.HostelId == managerHostelId && !u.IsApproved)
            .Select(u => new 
            { 
                u.Id, 
                u.DisplayName, 
                u.Email, 
                u.UserName,
                u.PreferredRoomId, 
                u.PreferenceNote,
                ProfilePictureUrl = string.IsNullOrEmpty(u.ProfilePictureUrl) ? "/default-avatar.svg" : u.ProfilePictureUrl
            })
            .ToListAsync();

        return SuccessResponse("Pending users fetched successfully.", pendingUsers);
    }

    [HttpPost("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser(string userId, [FromBody] ApproveUserRequestDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        if (dto == null || string.IsNullOrWhiteSpace(dto.AllocatedRoomId))
            return ErrorResponse("Allocated room is required.");

        var allocatedRoomId = dto.AllocatedRoomId.Trim();

        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null) 
            return ErrorResponse("User not found.", StatusCodes.Status404NotFound);
            
        if (user.HostelId != managerHostelId) 
            return ErrorResponse("You can only approve users of your own hostel.", StatusCodes.Status403Forbidden);
            
        if (user.IsApproved) 
            return ErrorResponse("User is already approved.");

        var room = await _context.Rooms.FindAsync(allocatedRoomId);
        if (room == null) 
            return ErrorResponse("Allocated room not found.", StatusCodes.Status404NotFound);

        if (room.HostelId != managerHostelId)
            return ErrorResponse("That room does not belong to your hostel.", StatusCodes.Status403Forbidden);
            
        if (room.SeatAvailable <= 0) 
            return ErrorResponse("No seats available in this room.");

        user.IsApproved = true;
        user.AllocatedRoomId = allocatedRoomId;
        room.SeatAvailable -= 1;

        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            await _context.SaveChangesAsync();
            var mgrId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var mgr = await _userManager.FindByIdAsync(mgrId!);
            await _activity.LogAsync(mgrId, mgr?.Email, "Manager", "BoarderApproved", "User", managerHostelId, userId,
                $"room={room.RoomNumber}");
            return SuccessResponse($"{user.UserName} has been approved and assigned to room {room.RoomNumber}.");
        }

        return ErrorResponse("Failed to approve user.");
    }

    [HttpGet("rooms")]
    public async Task<IActionResult> GetHostelRooms()
    {
        var managerHostelId = User.FindFirstValue("HostelId"); 
        
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var rooms = await _context.Rooms
            .Where(r => r.HostelId == managerHostelId)
            .OrderBy(r => r.FloorNo)      
            .ThenBy(r => r.RoomNumber)    
            .Select(r => new 
            {
                r.Id,
                r.RoomNumber,
                r.FloorNo,
                r.SeatCapacity,
                r.SeatAvailable,
                r.MonthlyRent,
                r.EstimatedMonthlyCost,
                r.IsAcAvailable,
                r.IsAttachedBathroomAvailable,
                r.IsBalconyAvailable,
                r.IsActive
            })
            .ToListAsync();

        return SuccessResponse("Rooms fetched successfully.", rooms);
    }

    [HttpPost("rooms")]
    public async Task<IActionResult> AddRoom([FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var newRoom = new Room
        {
            RoomNumber = roomDto.RoomNumber,
            FloorNo = roomDto.FloorNo,
            SeatCapacity = roomDto.SeatCapacity,
            SeatAvailable = roomDto.SeatCapacity, 
            MonthlyRent = roomDto.MonthlyRent,
            EstimatedMonthlyCost = roomDto.EstimatedMonthlyCost,
            IsAttachedBathroomAvailable = roomDto.IsAttachedBathroomAvailable,
            IsBalconyAvailable = roomDto.IsBalconyAvailable,
            IsAcAvailable = roomDto.IsAcAvailable,
            IsActive = roomDto.IsActive,
            HostelId = managerHostelId 
        };

        _context.Rooms.Add(newRoom);
        await _context.SaveChangesAsync();

        var mgrId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr = await _userManager.FindByIdAsync(mgrId!);
        await _activity.LogAsync(mgrId, mgr?.Email, "Manager", "RoomAdded", "Room", managerHostelId, null, newRoom.RoomNumber);

        return SuccessResponse($"Room {newRoom.RoomNumber} added successfully.");
    }

    [HttpPut("rooms/{roomId}")]
    public async Task<IActionResult> UpdateRoom(string roomId, [FromBody] RoomDto roomDto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId)) 
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);
        
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) 
            return ErrorResponse("Room not found.", StatusCodes.Status404NotFound);

        if (room.HostelId != managerHostelId) 
            return ErrorResponse("You can only update rooms in your own hostel.", StatusCodes.Status403Forbidden);

        room.RoomNumber = roomDto.RoomNumber!;
        room.FloorNo = roomDto.FloorNo;
        room.MonthlyRent = roomDto.MonthlyRent;
        room.EstimatedMonthlyCost = roomDto.EstimatedMonthlyCost;
        room.IsAttachedBathroomAvailable = roomDto.IsAttachedBathroomAvailable;
        room.IsBalconyAvailable = roomDto.IsBalconyAvailable;
        room.IsAcAvailable = roomDto.IsAcAvailable;
        room.IsActive = roomDto.IsActive;

        if (roomDto.SeatCapacity != room.SeatCapacity)
        {
            var difference = roomDto.SeatCapacity - room.SeatCapacity;
            room.SeatAvailable += difference; 
            room.SeatCapacity = roomDto.SeatCapacity;
        }

        await _context.SaveChangesAsync();

        var mgrId2 = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr2 = await _userManager.FindByIdAsync(mgrId2!);
        await _activity.LogAsync(mgrId2, mgr2?.Email, "Manager", "RoomUpdated", "Room", managerHostelId, null, room.RoomNumber);

        return SuccessResponse($"Room {room.RoomNumber} updated successfully.");
    }

    [HttpGet("activity-logs")]
    public async Task<IActionResult> GetHostelActivityLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var boarderIds = await _userManager.Users.AsNoTracking()
            .Where(u => u.HostelId == managerHostelId)
            .Select(u => u.Id)
            .ToListAsync();

        var q = _context.ActivityLogs.AsNoTracking()
            .Where(l =>
                l.HostelId == managerHostelId
                || (l.TargetUserId != null && boarderIds.Contains(l.TargetUserId))
                || (l.ActorUserId != null && boarderIds.Contains(l.ActorUserId)))
            .OrderByDescending(l => l.CreatedAt);

        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(l => new
            {
                l.Id,
                l.CreatedAt,
                l.ActorEmail,
                l.ActorRole,
                l.Action,
                l.Category,
                l.HostelId,
                l.TargetUserId,
                l.Details
            })
            .ToListAsync();

        return SuccessResponse("Hostel activity logs loaded.", new { total, page, pageSize, items });
    }

    [HttpPost("mock-platform-payment")]
    public async Task<IActionResult> MockPlatformPayment([FromBody] MockManagerPlatformPaymentDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return ErrorResponse("Unauthorized.", StatusCodes.Status401Unauthorized);

        if (dto.Month is < 1 or > 12)
            return ErrorResponse("Invalid month.");

        var hostel = await _context.Hostels
            .Include(h => h.SubscriptionPackage)
            .FirstOrDefaultAsync(h => h.Id == managerHostelId && h.ManagerId == userId);
        if (hostel == null)
            return ErrorResponse("Hostel not found or you are not the assigned manager.", StatusCodes.Status403Forbidden);

        var amount = hostel.SubscriptionPackage?.MonthlyPrice ?? 0;
        if (amount <= 0)
            return ErrorResponse("Your subscription package has no monthly platform fee.");

        var dup = await _context.ManagerPlatformPayments.AnyAsync(p =>
            p.HostelId == managerHostelId && p.Year == dto.Year && p.Month == dto.Month);
        if (dup)
            return ErrorResponse("Platform fee for this month is already recorded.");

        var trx = "MOCK_PLAT_" + Guid.NewGuid().ToString("N")[..12].ToUpperInvariant();
        _context.ManagerPlatformPayments.Add(new ManagerPlatformPayment
        {
            HostelId = managerHostelId,
            ManagerUserId = userId,
            Year = dto.Year,
            Month = dto.Month,
            Amount = amount,
            SubscriptionPackageId = hostel.SubscriptionPackageId,
            Status = "Paid",
            PaymentMethod = "Mock_" + dto.PaymentMethod,
            TransactionId = trx
        });
        await _context.SaveChangesAsync();

        var mgr = await _userManager.FindByIdAsync(userId);
        await _activity.LogAsync(userId, mgr?.Email, "Manager", "PlatformFeePaid", "Payment", managerHostelId, null,
            $"amount={amount},trx={trx},{dto.Year}-{dto.Month:00}");

        return SuccessResponse("Mock platform payment successful.", new { transactionId = trx, amount });
    }

    [HttpPost("hostel-photos")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadHostelPhoto(IFormFile file, [FromForm] bool setAsMain = false)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var hostel = await _context.Hostels.FirstOrDefaultAsync(h => h.Id == managerHostelId && h.ManagerId == userId);
        if (hostel == null)
            return ErrorResponse("Hostel not found or you are not the assigned manager.", StatusCodes.Status403Forbidden);

        if (file == null || file.Length == 0)
            return ErrorResponse("No file uploaded.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not ".jpg" and not ".jpeg" and not ".png" and not ".webp")
            return ErrorResponse("Only JPG, PNG, or WEBP images are allowed.");

        var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "hostels", managerHostelId);
        Directory.CreateDirectory(folder);
        var name = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(folder, name);
        await using (var stream = new FileStream(fullPath, FileMode.Create))
            await file.CopyToAsync(stream);

        var url = $"/uploads/hostels/{managerHostelId}/{name}";

        if (setAsMain)
        {
            var existing = await _context.HostelPhotos.Where(p => p.HostelId == managerHostelId).ToListAsync();
            foreach (var p in existing)
                p.IsMain = false;
        }

        var anyPhoto = await _context.HostelPhotos.AnyAsync(p => p.HostelId == managerHostelId);
        _context.HostelPhotos.Add(new HostelPhoto
        {
            Url = url,
            IsMain = setAsMain || !anyPhoto,
            HostelId = managerHostelId
        });
        await _context.SaveChangesAsync();

        var mgr = await _userManager.FindByIdAsync(userId!);
        await _activity.LogAsync(userId, mgr?.Email, "Manager", "HostelPhotoUploaded", "Hostel", managerHostelId, null, url);

        return SuccessResponse("Photo uploaded.", new { url });
    }

    [HttpGet("hostel-photos")]
    public async Task<IActionResult> ListHostelPhotos()
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var ok = await _context.Hostels.AnyAsync(h => h.Id == managerHostelId && h.ManagerId == userId);
        if (!ok)
            return ErrorResponse("Forbidden.", StatusCodes.Status403Forbidden);

        var photos = await _context.HostelPhotos.AsNoTracking()
            .Where(p => p.HostelId == managerHostelId)
            .OrderByDescending(p => p.IsMain)
            .ThenBy(p => p.Id)
            .Select(p => new { p.Id, p.Url, p.IsMain })
            .ToListAsync();

        return SuccessResponse("Photos loaded.", photos);
    }

    [HttpGet("boarders")]
    public async Task<IActionResult> ListApprovedBoarders()
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var users = await _userManager.Users.AsNoTracking()
            .Where(u => u.HostelId == managerHostelId && u.IsApproved)
            .OrderBy(u => u.DisplayName)
            .Select(u => new
            {
                u.Id,
                u.DisplayName,
                u.UserName,
                u.Email,
                u.PhoneNumber,
                u.AllocatedRoomId,
                ProfilePictureUrl = string.IsNullOrEmpty(u.ProfilePictureUrl) ? "/default-avatar.svg" : u.ProfilePictureUrl
            })
            .ToListAsync();

        var roomIds = users.Select(u => u.AllocatedRoomId).Where(id => !string.IsNullOrEmpty(id)).Distinct().ToList()!;
        var roomLookup = await _context.Rooms.AsNoTracking()
            .Where(r => roomIds.Contains(r.Id))
            .ToDictionaryAsync(r => r.Id, r => r.RoomNumber);

        var rows = users.Select(u => new
        {
            u.Id,
            u.DisplayName,
            u.UserName,
            u.Email,
            u.PhoneNumber,
            u.AllocatedRoomId,
            u.ProfilePictureUrl,
            RoomNumber = u.AllocatedRoomId != null && roomLookup.TryGetValue(u.AllocatedRoomId, out var rn) ? rn : (string?)null
        }).ToList();

        return SuccessResponse("Boarders loaded.", rows);
    }

    [HttpPost("boarders/{userId}/reallocate")]
    public async Task<IActionResult> ReallocateBoarder(string userId, [FromBody] ReallocateBoarderDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);
        if (dto == null || string.IsNullOrWhiteSpace(dto.NewRoomId))
            return ErrorResponse("New room is required.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || user.HostelId != managerHostelId || !user.IsApproved)
            return ErrorResponse("Boarder not found in your hostel.", StatusCodes.Status404NotFound);

        var newRoom = await _context.Rooms.FindAsync(dto.NewRoomId.Trim());
        if (newRoom == null || newRoom.HostelId != managerHostelId)
            return ErrorResponse("Invalid room for this hostel.", StatusCodes.Status400BadRequest);
        if (newRoom.SeatAvailable <= 0)
            return ErrorResponse("No seats available in the selected room.");

        if (string.Equals(user.AllocatedRoomId, newRoom.Id, StringComparison.Ordinal))
            return SuccessResponse("বোর্ডার ইতিমধ্যে এই রুমে আছে।");

        if (!string.IsNullOrEmpty(user.AllocatedRoomId))
        {
            var oldRoom = await _context.Rooms.FindAsync(user.AllocatedRoomId);
            if (oldRoom != null)
            {
                oldRoom.SeatAvailable += 1;
            }
        }

        newRoom.SeatAvailable -= 1;
        user.AllocatedRoomId = newRoom.Id;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return ErrorResponse("Failed to update boarder.");

        await _context.SaveChangesAsync();

        var mgrId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr = await _userManager.FindByIdAsync(mgrId!);
        await _activity.LogAsync(mgrId, mgr?.Email, "Manager", "BoarderReallocated", "User", managerHostelId, userId,
            $"room={newRoom.RoomNumber}");

        return SuccessResponse($"বোর্ডারকে রুম {newRoom.RoomNumber} এ বরাদ্দ করা হয়েছে।");
    }

    [HttpPost("boarders/{userId}/remove-from-hostel")]
    public async Task<IActionResult> RemoveBoarderFromHostel(string userId)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || user.HostelId != managerHostelId)
            return ErrorResponse("User not found in your hostel.", StatusCodes.Status404NotFound);

        if (!string.IsNullOrEmpty(user.AllocatedRoomId))
        {
            var room = await _context.Rooms.FindAsync(user.AllocatedRoomId);
            if (room != null && room.HostelId == managerHostelId)
                room.SeatAvailable += 1;
        }

        user.IsApproved = false;
        user.AllocatedRoomId = null;
        user.PreferredRoomId = null;
        user.HostelId = string.Empty;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return ErrorResponse("Failed to remove boarder.");

        await _context.SaveChangesAsync();

        var mgrId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr = await _userManager.FindByIdAsync(mgrId!);
        await _activity.LogAsync(mgrId, mgr?.Email, "Manager", "BoarderRemovedFromHostel", "User", managerHostelId, userId, null);

        return SuccessResponse("বোর্ডারকে হোস্টেল থেকে সরানো হয়েছে।");
    }

    [HttpPost("boarders/{userId}/extra-charge")]
    public async Task<IActionResult> AddExtraChargeToBoarderBill(string userId, [FromBody] BoarderExtraChargeDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);
        if (dto.Month is < 1 or > 12 || dto.Year < 2000 || dto.Year > 2100)
            return ErrorResponse("Invalid month or year.");
        if (dto.Amount <= 0)
            return ErrorResponse("Amount must be greater than zero.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || user.HostelId != managerHostelId || !user.IsApproved)
            return ErrorResponse("Boarder not found in your hostel.", StatusCodes.Status404NotFound);

        var bill = await _context.MonthlyBills
            .FirstOrDefaultAsync(b => b.UserId == userId && b.HostelId == managerHostelId && b.Month == dto.Month && b.Year == dto.Year);

        if (bill != null)
        {
            bill.AdditionalCharge += dto.Amount;
            bill.TotalAmount += dto.Amount;
            if (bill.PaidAmount < bill.TotalAmount && bill.Status == "Paid")
                bill.Status = "Partial";
            else if (bill.PaidAmount < bill.TotalAmount)
                bill.Status = bill.PaidAmount > 0 ? "Partial" : "Unpaid";
        }
        else
        {
            decimal seatRent = 0;
            if (!string.IsNullOrEmpty(user.AllocatedRoomId))
            {
                var room = await _context.Rooms.FindAsync(user.AllocatedRoomId);
                if (room != null && room.HostelId == managerHostelId)
                    seatRent = room.MonthlyRent;
            }

            bill = new MonthlyBill
            {
                UserId = userId,
                HostelId = managerHostelId,
                Month = dto.Month,
                Year = dto.Year,
                SeatRent = seatRent,
                MealCharge = 0,
                UtilityCharge = 0,
                AdditionalCharge = dto.Amount,
                TotalAmount = seatRent + dto.Amount,
                PaidAmount = 0,
                Status = "Unpaid"
            };
            _context.MonthlyBills.Add(bill);
        }

        await _context.SaveChangesAsync();

        var mgrId2 = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr2 = await _userManager.FindByIdAsync(mgrId2!);
        await _activity.LogAsync(mgrId2, mgr2?.Email, "Manager", "BoarderExtraCharge", "Billing", managerHostelId, userId,
            $"m={dto.Month},y={dto.Year},amt={dto.Amount}");

        return SuccessResponse("অতিরিক্ত চার্জ বিলে যুক্ত হয়েছে। বোর্ডার ড্যাশবোর্ডে বকেয়া আপডেট হবে।");
    }

    [HttpPost("boarders/{userId}/generate-bill")]
    public async Task<IActionResult> GenerateBillForBoarder(string userId, [FromBody] ManagerSingleBoarderBillDto dto)
    {
        var managerHostelId = User.FindFirstValue("HostelId");
        if (string.IsNullOrEmpty(managerHostelId))
            return ErrorResponse("Hostel ID missing in token.", StatusCodes.Status401Unauthorized);
        if (dto.Month is < 1 or > 12)
            return ErrorResponse("Invalid month.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || user.HostelId != managerHostelId || !user.IsApproved || string.IsNullOrEmpty(user.AllocatedRoomId))
            return ErrorResponse("Boarder not found or has no allocated room.", StatusCodes.Status404NotFound);

        var exists = await _context.MonthlyBills.AnyAsync(b =>
            b.UserId == userId && b.HostelId == managerHostelId && b.Month == dto.Month && b.Year == dto.Year);
        if (exists)
            return ErrorResponse("This month already has a bill for this boarder.");

        var room = await _context.Rooms.FindAsync(user.AllocatedRoomId);
        if (room == null || room.HostelId != managerHostelId)
            return ErrorResponse("Room not found.");

        var seatRent = room.MonthlyRent;
        var total = seatRent + dto.UtilityCharge + dto.AdditionalCharge;
        var bill = new MonthlyBill
        {
            UserId = userId,
            HostelId = managerHostelId,
            Month = dto.Month,
            Year = dto.Year,
            SeatRent = seatRent,
            MealCharge = 0,
            UtilityCharge = dto.UtilityCharge,
            AdditionalCharge = dto.AdditionalCharge,
            TotalAmount = total,
            PaidAmount = 0,
            Status = "Unpaid"
        };
        _context.MonthlyBills.Add(bill);
        await _context.SaveChangesAsync();

        var mgrId3 = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var mgr3 = await _userManager.FindByIdAsync(mgrId3!);
        await _activity.LogAsync(mgrId3, mgr3?.Email, "Manager", "BoarderBillGenerated", "Billing", managerHostelId, userId,
            $"m={dto.Month},y={dto.Year},total={total}");

        return SuccessResponse("মাসিক বিল তৈরি হয়েছে।", new { bill.Id, bill.TotalAmount });
    }
}