using System;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Rooms.Commands;

public class Create 
{
    public class Command : IRequest<string>
    {
        public required string RoomNumber { get; set; } 
        public int FloorNo { get; set; }
        public int SeatCapacity { get; set; } 
        public int SeatAvailable { get; set; }
        public int IsAttachedBathroomAvailable {get; set;}
        public int IsBalconyAvailable {get; set;}
        public bool IsAcAvailable { get; set; } 
        public bool IsActive { get; set; } = true; 
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            var rooms = mapper.Map<Room>(request);
            context.Rooms.Add(rooms);
            var isChanged = await context.SaveChangesAsync(cancellationToken) > 0;
            if (!isChanged) throw new Exception("Problem while creating new Room!");
            return rooms.Id;
        }
    }

}
