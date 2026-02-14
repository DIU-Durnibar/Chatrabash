using System;
using FluentValidation;
using MediatR;

namespace Application.Core;

public class ValidatorBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse> 
        where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if(validator == null) return await next();
        
        var ValidationResult = await validator.ValidateAsync(request, cancellationToken);
        
 
        if(!ValidationResult.IsValid) throw new ValidationException(ValidationResult.Errors);

        return await next(); 

    }
}

