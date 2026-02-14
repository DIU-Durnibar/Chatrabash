using System;
using MediatR;
using Domain;
using Persistence;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Application.Rooms.Dtos;

namespace Application.Rooms.Queries;

public class GetAllRooms
{
    public class Query : IRequest<List<GetAllRoomsDto>>{ }
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, List<GetAllRoomsDto>>
    {
        public async Task<List<GetAllRoomsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var rooms = await context.Rooms.ToListAsync(cancellationToken);
            if (rooms == null) throw new Exception("Problem Occured While Getting Rooms!");
            var allRoomsDto = mapper.Map<List<GetAllRoomsDto>>(rooms);
            return allRoomsDto;
        }
    }
}
