using TrainingJournal.API.Contracts;
using TrainingJournal.API.Services.Interfaces;

namespace TrainingJournal.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("auth").WithTags("Auth");

        group.MapPost("/login", async (LoginRequest request, IAuthService authService) =>
        {
            // 1. Call Service directly
            // If email is empty -> Service throws ArgumentException -> GlobalHandler returns 400
            // If DB is down -> Repository throws NpgsqlException -> GlobalHandler returns 503
            var user = await authService.VerifyUserExistsAsync(request.Email);

            // 2. Handle Logic Result (Not an Exception)
            if (user is null)
            {
                // We typically don't throw an exception for "Login Failed" 
                // because it's a valid business outcome, not a system error.
                return Results.Unauthorized();
            }

            return Results.Ok(user);
        });
    }
}