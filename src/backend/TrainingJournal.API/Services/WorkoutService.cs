using TrainingJournal.Api.Models;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services.Interfaces;

namespace TrainingJournal.API.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _repo;

    public WorkoutService(IWorkoutRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<WorkoutSummaryResponse>> GetAllSummariesAsync(Guid userId)
    {
        var workouts = await _repo.GetAllByUserIdAsync(userId);
        return workouts.Select(w => new WorkoutSummaryResponse(w.Id, w.Name, w.Date));
    }

    public async Task<WorkoutResponse?> GetByIdAsync(Guid id, Guid userId)
    {
        var workout = await _repo.GetOwnedByIdAsync(id, userId);
        if (workout is null) return null;
        
        return MapToResponse(workout);
    }

    public async Task<WorkoutResponse> CreateAsync(CreateWorkoutRequest request, Guid userId)
    {
        // 1. Business Logic: Check for duplicates
        var exists = await _repo.ExistsAsync(userId, request.Name, request.Date);
        if (exists)
        {
            throw new InvalidOperationException($"A workout named '{request.Name}' already exists for this date.");
        }

        // 2. Logic: ID Generation & Domain Mapping
        var newWorkoutId = Guid.NewGuid();
        var domainWorkout = new Workout
        {
            Id = newWorkoutId,
            UserId = userId,
            Name = request.Name,
            Date = request.Date,
            Exercises = MapExercisesInputToDomain(request.Exercises, newWorkoutId)
        };

        // 3. Persistence
        var success = await _repo.CreateFullWorkoutAsync(domainWorkout);
        
        if (!success) 
            throw new Exception("Failed to create workout in database.");

        return MapToResponse(domainWorkout);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateWorkoutRequest request, Guid userId)
    {
        var workoutToUpdate = new Workout
        {
            Id = id,
            UserId = userId,
            Name = request.Name,
            Date = request.Date,
            Exercises = MapExercisesInputToDomain(request.Exercises, id)
        };

        return await _repo.UpdateFullWorkoutAsync(workoutToUpdate);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        return await _repo.DeleteOwnedAsync(id, userId);
    }

    // PRIVATE MAPPERS

    private static List<ExerciseLog> MapExercisesInputToDomain(List<WorkoutExerciseInputDto> inputExercises, Guid workoutId)
    {
        return [.. inputExercises.Select(e => 
        {
            var exerciseId = Guid.NewGuid();
            return new ExerciseLog
            {
                Id = exerciseId,
                WorkoutId = workoutId,
                Name = e.Name,
                
                // CAP 1: Position cannot be negative
                Position = Math.Max(0, e.Position), 
                
                Sets = [.. e.Sets.Select(s => 
                {
                    var setId = Guid.NewGuid();
                    return new WorkoutSet
                    {
                        Id = setId,
                        ExerciseId = exerciseId,
                        
                        // CAP 2: Set Number cannot be negative
                        SetNumber = Math.Max(1, s.SetNumber),
                        
                        Reps = [.. s.Reps.Select(r => new RepLog
                        {
                            Id = Guid.NewGuid(),
                            SetId = setId,
                            
                            // CAP 3: Weight cannot be negative (Set to 0)
                            Weight = Math.Max(0, r.Weight),
                            
                            // CAP 4: Rep Number cannot be negative
                            RepNumber = Math.Max(1, r.RepNumber)
                        })]
                    };
                })]
            };
        })];
    }

    private static WorkoutResponse MapToResponse(Workout w)
    {
        return new WorkoutResponse(
            w.Id, w.UserId, w.Name, w.Date,
            [.. w.Exercises.Select(e => new ExerciseResponseDto(
                e.Id, e.WorkoutId, e.Name, e.Position,
                [.. e.Sets.Select(s => new SetResponseDto(
                    s.Id, s.ExerciseId, s.SetNumber,
                    [.. s.Reps.Select(r => new RepResponseDto(
                        r.Id, r.SetId, r.Weight, r.RepNumber
                    ))]
                ))]
            ))]
        );
    }
}