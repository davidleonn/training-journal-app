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
            if (string.IsNullOrWhiteSpace(request.Email))
                return Results.BadRequest("Email required.");

            var user = await authService.VerifyUserExistsAsync(request.Email);

            return user is null 
                ? Results.Unauthorized() 
                : Results.Ok(user);
        });
    }
}