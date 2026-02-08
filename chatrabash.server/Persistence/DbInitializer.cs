using System;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization.DataContracts;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DbInitializer
{
    private static List<Room> _rooms = new List<Room>
    {
        new Room { RoomNumber = "G-101", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 0, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "G-102", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 2, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "G-103", FloorNo = 0, SeatCapacity = 3, SeatAvailable = 1, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "G-104", FloorNo = 0, SeatCapacity = 4, SeatAvailable = 4, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "G-Store", FloorNo = 0, SeatCapacity = 0, SeatAvailable = 0, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = false }, 

        new Room { RoomNumber = "101", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 0, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "102", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true }, 
        new Room { RoomNumber = "103", FloorNo = 1, SeatCapacity = 3, SeatAvailable = 2, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "104", FloorNo = 1, SeatCapacity = 3, SeatAvailable = 0, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "105", FloorNo = 1, SeatCapacity = 2, SeatAvailable = 2, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },

        new Room { RoomNumber = "201", FloorNo = 2, SeatCapacity = 1, SeatAvailable = 0, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true }, 
        new Room { RoomNumber = "202", FloorNo = 2, SeatCapacity = 2, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "203", FloorNo = 2, SeatCapacity = 2, SeatAvailable = 2, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "204", FloorNo = 2, SeatCapacity = 1, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true },
        new Room { RoomNumber = "205", FloorNo = 2, SeatCapacity = 0, SeatAvailable = 0, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 0, IsAcAvailable = false, IsActive = false }, 

        new Room { RoomNumber = "301", FloorNo = 3, SeatCapacity = 1, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = true, IsActive = true }, 
        new Room { RoomNumber = "302", FloorNo = 3, SeatCapacity = 2, SeatAvailable = 0, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = true, IsActive = true },
        new Room { RoomNumber = "303", FloorNo = 3, SeatCapacity = 2, SeatAvailable = 2, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 0, IsAcAvailable = true, IsActive = true },
        new Room { RoomNumber = "304", FloorNo = 3, SeatCapacity = 3, SeatAvailable = 1, IsAttachedBathroomAvailable = 1, IsBalconyAvailable = 1, IsAcAvailable = true, IsActive = true },

        new Room { RoomNumber = "401", FloorNo = 4, SeatCapacity = 4, SeatAvailable = 3, IsAttachedBathroomAvailable = 0, IsBalconyAvailable = 1, IsAcAvailable = false, IsActive = true }
    };

    public static async Task Seed(AppDbContext context)
    {
        if(context.Rooms.Any()) return;
        await context.Rooms.AddRangeAsync(_rooms);
        await context.SaveChangesAsync();
    
    }
}

    

