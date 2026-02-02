using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace TrainingJournal.API;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // 1. Log the REAL error (with stack trace) so you can fix it later
        _logger.LogError(exception, "An unexpected error occurred: {Message}", exception.Message);

        // 2. Decide what to tell the user based on the error type
        // Map C# Exceptions to HTTP Status Codes
        var (statusCode, title, message) = exception switch
        {
            // Handle Duplicate Email (Unique Violation)
            // Code "23505" is Postgres-speak for "This value already exists"
            PostgresException pgEx when pgEx.SqlState == "23505"
                => (StatusCodes.Status409Conflict, "Conflict", "A user with this email already exists."),

            //  Handle Invalid ID Format (e.g. "abc" instead of GUID)
            BadHttpRequestException
        => (StatusCodes.Status400BadRequest, "Bad Request", "The request input was invalid."),

            // This handles format errors (like sending "abc" for a Guid)
            FormatException
                => (StatusCodes.Status400BadRequest, "Invalid Format", "The provided ID was not a valid UUID."),

            // Handle Connection Issues (Database Down)
            NpgsqlException ex when ex.Message.Contains("Connection refused")
                => (StatusCodes.Status503ServiceUnavailable, "Service Unavailable", "Database is currently down."),

            // Handle Bad Request (Validation)
            ArgumentException
                => (StatusCodes.Status400BadRequest, "Bad Request", exception.Message),

            // Handle Not Found
            KeyNotFoundException
                => (StatusCodes.Status404NotFound, "Not Found", "The requested resource was not found."),

            // Catch-All (Generic 500)
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", "An unexpected error occurred.")
        };

        // 3. Create the standard "ProblemDetails" response
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = message,
            Type = exception.GetType().Name,
            Instance = httpContext.Request.Path
        };

        // 4. Send the response
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // "True" means we handled it, so ASP.NET can stop panicking
    }
}