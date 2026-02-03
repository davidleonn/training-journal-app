using Microsoft.AspNetCore.Mvc;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Core.Interfaces; 

namespace TrainingJournal.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("auth").WithTags("Auth");

        // We point to the static method instead of writing code here
        group.MapPost("/login", LoginHandler);
    }

    public static async Task<IResult> LoginHandler(
        [FromBody] LoginRequest request, 
        IAuthService authService, 
        ITokenService tokenService)
    {
        var user = await authService.VerifyUserExistsAsync(request.Email);

        if (user is null)
        {
            return Results.Problem(detail: "User not found", statusCode: 401);
        }

        var authResult = tokenService.CreateToken(user.Email, user.Id.ToString());

        return Results.Ok(new LoginResponse(authResult.Token, authResult.Expires));
    }
}