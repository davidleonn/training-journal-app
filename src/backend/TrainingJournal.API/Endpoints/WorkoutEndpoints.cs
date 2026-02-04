using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TrainingJournal.Api.Models;
using TrainingJournal.API.Contracts; // 👈 Don't forget this using
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Endpoints;

public static class WorkoutEndpoints
{
    // Use 'this IEndpointRouteBuilder app' to match your UserEndpoints style
    public static void MapWorkoutEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/workouts").WithTags("Workouts").RequireAuthorization();

        // GET /workouts (History)
        group.MapGet("/", async (IWorkoutRepository repo) =>
        {
            var workouts = await repo.GetAllAsync();
            
            // MAP: Domain Model -> API Response
            var response = workouts.Select(w => new WorkoutResponse(
                w.Id, w.UserId, w.Name, w.Date, w.Exercises
            ));
            
            return Results.Ok(response);
        });

        // GET /workouts/{id} (Single Session)
        group.MapGet("/{id:guid}", async (Guid id, IWorkoutRepository repo) =>
        {
            var workout = await repo.GetByIdAsync(id);
            
            return workout is not null
                ? Results.Ok(new WorkoutResponse(workout.Id, workout.UserId, workout.Name, workout.Date, workout.Exercises))
                : Results.NotFound();
        });

        // POST /workouts (Save New)
        group.MapPost("/", async ([FromBody] CreateWorkoutRequest request, IWorkoutRepository repo, ClaimsPrincipal user) =>
        {
            // 1. Security: Get User ID from Token
            var userIdString = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Results.Unauthorized();

            // 2. MAP: Contract (Request) -> Domain Model (Database)
            var newWorkout = new Workout
            {
                Id = Guid.NewGuid(), // We generate the ID here
                UserId = userId,
                Name = request.Name,
                Date = request.Date,
                Exercises = request.Exercises
            };

            // 3. Save to DB
            var success = await repo.CreateFullWorkoutAsync(newWorkout);

            if (!success) return Results.Problem("Failed to save workout.");

            // 4. Return the Response Contract
            var response = new WorkoutResponse(newWorkout.Id, newWorkout.UserId, newWorkout.Name, newWorkout.Date, newWorkout.Exercises);
            return Results.Created($"/workouts/{newWorkout.Id}", response);
        });

        // PUT /workouts/{id} (Update Existing)
        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateWorkoutRequest request, IWorkoutRepository repo, ClaimsPrincipal user) =>
        {
            var userIdString = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Results.Unauthorized();

            // MAP: Contract -> Domain Model
            var workoutToUpdate = new Workout
            {
                Id = id, // Use the ID from the URL
                UserId = userId, // Important: prevents stealing other users' workouts
                Name = request.Name,
                Date = request.Date,
                Exercises = request.Exercises
            };

            var success = await repo.UpdateFullWorkoutAsync(workoutToUpdate);

            return success ? Results.NoContent() : Results.NotFound();
        });

        // DELETE /workouts/{id}
        group.MapDelete("/{id:guid}", async (Guid id, IWorkoutRepository repo) =>
        {
            var success = await repo.DeleteAsync(id);
            return success ? Results.NoContent() : Results.NotFound();
        });
    }
}