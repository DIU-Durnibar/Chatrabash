using System;
using System.Data;
using FluentValidation;

namespace Application.Rooms.Validators;

public class Create : AbstractValidator<Rooms.Commands.Create.Command>
{
    public Create()
    {
        RuleFor(x => x.RoomNumber).NotEmpty().WithMessage("Room Number is required!");
        RuleFor(x => x.FloorNo).NotEmpty().WithMessage("Floor Number is required!");
        RuleFor(x => x.SeatAvailable).NotEmpty().WithMessage("Cannot be empty");
        RuleFor(x => x.SeatCapacity).NotNull().GreaterThan(0).WithMessage("Must be more than 0");
    }
}
