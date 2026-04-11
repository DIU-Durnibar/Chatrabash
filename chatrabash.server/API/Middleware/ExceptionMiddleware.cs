using System;
using System.Text.Json;
using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        } 
        catch(ValidationException ex)
        {
            await HandleExceptionAsync(context, ex);
        }
        catch(Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response = env.IsDevelopment() 
            ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace) 
            : new AppException(context.Response.StatusCode, ex.Message, null);

        var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
        
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
            await Task.CompletedTask;
        }
    }
}