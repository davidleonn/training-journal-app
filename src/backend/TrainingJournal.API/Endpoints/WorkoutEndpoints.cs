using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Services.Interfaces;
using FluentValidation;

namespace TrainingJournal.API.Endpoints;

public static class WorkoutEndpoints
{
    public static void MapWorkoutEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/workouts").WithTags("Workouts").RequireAuthorization();

        group.MapGet("/", HandleGetAll);
        group.MapGet("/{id:guid}", HandleGetById);
        group.MapPost("/", HandleCreate);
        group.MapPut("/{id:guid}", HandleUpdate);
        group.MapDelete("/{id:guid}", HandleDelete);
    }

    // GET ALL (Summary)
    public static async Task<IResult> HandleGetAll(IWorkoutService service, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        if (userId == Guid.Empty) return Results.Unauthorized();

        var summaries = await service.GetAllSummariesAsync(userId);
        return Results.Ok(summaries);
    }

    // GET SINGLE
    public static async Task<IResult> HandleGetById(Guid id, IWorkoutService service, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        if (userId == Guid.Empty) return Results.Unauthorized();

        // Return 404 if service returns null
        var workout = await service.GetByIdAsync(id, userId) ?? throw new KeyNotFoundException($"Workout with id {id} was not found.");
        return Results.Ok(workout);
    }

    // CREATE
    public static async Task<IResult> HandleCreate(
        [FromBody] CreateWorkoutRequest request, 
        IWorkoutService service, 
        IValidator<CreateWorkoutRequest> validator,
        ClaimsPrincipal user)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        var userId = GetUserId(user);
        if (userId == Guid.Empty) return Results.Unauthorized();

        try 
        {
            var response = await service.CreateAsync(request, userId);
            return Results.Created($"/workouts/{response.Id}", response);
        }
        catch (InvalidOperationException ex) // Catch the Duplicate error
        {
            return Results.Conflict(new { message = ex.Message });
        }
    }

    // UPDATE
    public static async Task<IResult> HandleUpdate(
        Guid id, 
        [FromBody] UpdateWorkoutRequest request, 
        IWorkoutService service,
        IValidator<UpdateWorkoutRequest> validator, 
        ClaimsPrincipal user)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        var userId = GetUserId(user);
        if (userId == Guid.Empty) return Results.Unauthorized();

        var success = await service.UpdateAsync(id, request, userId);

        if (!success)
            throw new KeyNotFoundException($"Workout with id {id} was not found or access is denied.");
        
        return Results.NoContent();
    }

    // DELETE
    public static async Task<IResult> HandleDelete(Guid id, IWorkoutService service, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        if (userId == Guid.Empty) return Results.Unauthorized();

        var success = await service.DeleteAsync(id, userId);

        if (!success)
             throw new KeyNotFoundException($"Workout with id {id} was not found or access is denied.");

        return Results.NoContent();
    }

    // Helper just for Claims
    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var idString = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(idString, out var id) ? id : Guid.Empty;
    }
}