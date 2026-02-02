using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Contracts;
using System.Text.RegularExpressions;

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
        group.MapPost("/", async (CreateUserRequest request, IUserRepository repo) =>
        {
            // 1. Validation: Check if empty
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                throw new ArgumentException("Email cannot be empty.");
            }

            // 2. Validation: Check format (Basic Email Regex)
            // This pattern checks: non-spaces @ non-spaces . non-spaces
            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(request.Email, emailPattern))
            {
                throw new ArgumentException($"'{request.Email}' is not a valid email address.");
            }

            // 3. Map DTO -> Domain
            var newUser = new User
            {
                Email = request.Email,
                // Fix: Set the date here so the response matches the database
                CreatedAt = DateTime.UtcNow
            };

            // 4. Call Repo (Save to DB)
            var id = await repo.CreateAsync(newUser);

            // 5. Create Response DTO
            var response = new UserResponse(id, newUser.Email, newUser.CreatedAt);

            // 6. Return 201 Created with Location header
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