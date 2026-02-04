using TrainingJournal.Api.Models;

namespace TrainingJournal.API.Contracts;

// 1. REQUEST: What the frontend sends to CREATE a workout
// We don't ask for ID or UserId because the System/Token handles that.
public record CreateWorkoutRequest(
    string Name, 
    DateTimeOffset Date, 
    List<ExerciseLog> Exercises // Reusing Domain Model for the nested list to keep it simple
);

// 2. REQUEST: What the frontend sends to UPDATE a workout
public record UpdateWorkoutRequest(
    string Name, 
    DateTimeOffset Date, 
    List<ExerciseLog> Exercises
);

// 3. RESPONSE: What we send back to the frontend
public record WorkoutResponse(
    Guid Id, 
    Guid UserId, 
    string Name, 
    DateTimeOffset Date, 
    List<ExerciseLog> Exercises
);