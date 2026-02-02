using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Services;

namespace TrainingJournal.API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users").WithTags("Users");

        // GET /users
        // We map the Domain Users to UserResponses
        group.MapGet("/", async (IUserRepository repo) =>
        {
            var users = await repo.GetAllAsync();
            // Convert Domain -> DTO
            var response = users.Select(u => new UserResponse(u.Id, u.Email, u.CreatedAt));
            return Results.Ok(response);
        });

        // GET /users/{id}
        group.MapGet("/{id}", async (Guid id, IUserRepository repo) =>
        {
            var user = await repo.GetByIdAsync(id) ?? throw new KeyNotFoundException($"User with id {id} was not found.");
            // Convert Domain -> DTO
            return Results.Ok(new UserResponse(user.Id, user.Email, user.CreatedAt));
        });

        // POST /users
        group.MapPost("/", async (CreateUserRequest request, UserService service) =>
        {
            // 1. Map DTO -> Domain
            var newUser = new User
            {
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            // 2. Call Service
            // If validation fails -> Service throws ArgumentException -> GlobalHandler returns 400
            // If duplicate -> Service throws InvalidOperationException -> GlobalHandler returns 409
            var id = await service.RegisterUserAsync(newUser);

            // 3. Success Response
            var response = new UserResponse(id, newUser.Email, newUser.CreatedAt);
            return Results.Created($"/users/{id}", response);
        });

        // DELETE /users/{id}
        group.MapDelete("/{id}", async (Guid id, IUserRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);

            // If you want Delete to also throw 404 when missing, you can do:
            if (!deleted)
            {
                throw new KeyNotFoundException($"User with id {id} was not found.");
            }

            return Results.NoContent();
        });
    }
}