using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Contracts; // <--- Import the Contracts

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
            var user = await repo.GetByIdAsync(id);
            if (user is null) return Results.NotFound();

            // Convert Domain -> DTO
            return Results.Ok(new UserResponse(user.Id, user.Email, user.CreatedAt));
        });

        // POST /users
        // NOW: We accept CreateUserRequest, not User
        group.MapPost("/", async (CreateUserRequest request, IUserRepository repo) =>
        {
            // 1. Map DTO -> Domain
            // We create the domain object here. Ideally, use a factory or mapper later.
            var newUser = new User
            {
                Email = request.Email
                // Id and CreatedAt are handled by DB or defaults
            };

            // 2. Call Repo
            var id = await repo.CreateAsync(newUser);

            // 3. Return a clean Response DTO
            // Note: In a real app, you might fetch the created user to get the real CreatedAt date
            var response = new UserResponse(id, newUser.Email, DateTime.UtcNow);

            return Results.Created($"/users/{id}", response);
        });

        // DELETE /users/{id}
        group.MapDelete("/{id}", async (Guid id, IUserRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}