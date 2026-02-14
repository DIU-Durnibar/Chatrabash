using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        } 
        catch(Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    public static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        if (exception is ValidationException validationException)
        {

            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var validationErrors = new Dictionary<string, string[]>();


            foreach (var error in validationException.Errors)
            {

                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                {

                    validationErrors[error.PropertyName] = [.. existingErrors, error.ErrorMessage];
                }
                else
                {

                    validationErrors[error.PropertyName] = [error.ErrorMessage];
                }
            }

            var problemDetails = new ValidationProblemDetails(validationErrors)
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Validation Error",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more validation errors occurred.",
                Instance = context.Request.Path 
            };

            await context.Response.WriteAsJsonAsync(problemDetails);
        }

        else 
        {
            Console.WriteLine(exception); 
        }
    }
}