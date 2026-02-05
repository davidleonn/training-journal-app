namespace TrainingJournal.Api.Models;

public class Workout
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = "New Session";
    public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;
    
    // Navigation for Option B hierarchy
    public List<ExerciseLog> Exercises { get; set; } = new();
}

public class ExerciseLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid WorkoutId { get; set; } // <--- Needed for Dapper saving
    
    public string Name { get; set; } = string.Empty;
    public int Position { get; set; }
    public List<WorkoutSet> Sets { get; set; } = new();
}

public class WorkoutSet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ExerciseId { get; set; } // <--- Needed for Dapper saving
    
    public int SetNumber { get; set; }
    public List<RepLog> Reps { get; set; } = new();
}

public class RepLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid SetId { get; set; }
    
    public decimal Weight { get; set; }
    public int RepNumber { get; set; }
}