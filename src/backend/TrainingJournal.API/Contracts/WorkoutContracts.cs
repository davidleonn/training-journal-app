namespace TrainingJournal.API.Contracts;

public record CreateWorkoutRequest(
    string Name, 
    DateTimeOffset Date, 
    List<WorkoutExerciseInputDto> Exercises
);

public record UpdateWorkoutRequest(
    string Name, 
    DateTimeOffset Date, 
    List<WorkoutExerciseInputDto> Exercises
);

// We reuse these "Input DTOs" for both Create and Update
public record WorkoutExerciseInputDto(
    string Name, 
    int Position, 
    List<WorkoutSetInputDto> Sets
);

public record WorkoutSetInputDto(
    int SetNumber, 
    List<WorkoutRepInputDto> Reps
);

public record WorkoutRepInputDto(
    decimal Weight, 
    int RepNumber
);


// ==========================================
// 📤 OUTPUTS (Responses to Frontend)
// These include all the Database IDs.
// ==========================================

public record WorkoutResponse(
    Guid Id, 
    Guid UserId, 
    string Name, 
    DateTimeOffset Date, 
    List<ExerciseResponseDto> Exercises
);

public record ExerciseResponseDto(
    Guid Id, 
    Guid WorkoutId, 
    string Name, 
    int Position, 
    List<SetResponseDto> Sets
);

public record SetResponseDto(
    Guid Id, 
    Guid ExerciseId, 
    int SetNumber, 
    List<RepResponseDto> Reps
);

public record RepResponseDto(
    Guid Id, 
    Guid SetId, 
    decimal Weight, 
    int RepNumber
);

public record WorkoutSummaryResponse(
    Guid Id, 
    string Name, 
    DateTimeOffset Date
);