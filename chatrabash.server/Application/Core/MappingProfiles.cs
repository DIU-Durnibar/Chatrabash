using System;
using Application.Rooms.Commands;
using Application.Rooms.Dtos;
using AutoMapper;
using Domain;
using Application.Rooms;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Room, GetAllRoomsDto>();
        CreateMap<Rooms.Commands.Create.Command, Room>();
    }
}
