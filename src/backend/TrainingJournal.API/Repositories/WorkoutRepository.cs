using Dapper;
using TrainingJournal.Api.Models;
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Repositories;

public class WorkoutRepository : BaseRepository<Workout>, IWorkoutRepository
{
    public WorkoutRepository(IConfiguration config) : base(config, "workouts")
    {
    }

    public async Task<IEnumerable<Workout>> GetAllByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();
        // Security: Only select rows for this user
        return await connection.QueryAsync<Workout>(
            "SELECT * FROM workouts WHERE user_id = @UserId", 
            new { UserId = userId });
    }

    // 2. Secure GET ONE
    public async Task<Workout?> GetOwnedByIdAsync(Guid id, Guid userId)
    {
        using var connection = CreateConnection();
        
        // We write 4 SELECT statements in one string
        string sql = @"
            -- 1. Get the Workout
            SELECT * FROM workouts WHERE id = @Id AND user_id = @UserId;

            -- 2. Get the Exercises for this workout
            SELECT * FROM exercises_log WHERE workout_id = @Id ORDER BY position;

            -- 3. Get the Sets (Linked via the exercises found above)
            SELECT s.* FROM sets s
            JOIN exercises_log e ON s.exercise_id = e.id
            WHERE e.workout_id = @Id
            ORDER BY s.set_number;

            -- 4. Get the Reps (Linked via the sets -> exercises)
            SELECT r.* FROM reps_log r
            JOIN sets s ON r.set_id = s.id
            JOIN exercises_log e ON s.exercise_id = e.id
            WHERE e.workout_id = @Id
            ORDER BY r.rep_number;";

        using var multi = await connection.QueryMultipleAsync(sql, new { Id = id, UserId = userId });

        // A. Read the Parent
        var workout = await multi.ReadFirstOrDefaultAsync<Workout>();
        if (workout is null) return null;

        // B. Read the Children (Flat Lists)
        var exercises = (await multi.ReadAsync<ExerciseLog>()).ToList();
        var sets = (await multi.ReadAsync<WorkoutSet>()).ToList();
        var reps = (await multi.ReadAsync<RepLog>()).ToList();

        // C. Stitch them together in memory (The "Re-assembly")
        foreach (var exercise in exercises)
        {
            // Find sets belonging to this exercise
            exercise.Sets = sets.Where(s => s.ExerciseId == exercise.Id).ToList();

            foreach (var set in exercise.Sets)
            {
                // Find reps belonging to this set
                set.Reps = reps.Where(r => r.SetId == set.Id).ToList();
            }
        }

        // Assign the built tree to the parent
        workout.Exercises = exercises;

        return workout;
    }
    public async Task<bool> ExistsAsync(Guid userId, string name, DateTimeOffset date)
    {
        using var connection = CreateConnection();
        
        // We cast to DATE to compare just the day (ignoring hours/minutes)
        string sql = @"
            SELECT COUNT(1) 
            FROM workouts 
            WHERE user_id = @UserId 
            AND name = @Name 
            AND date::date = @Date::date";

        var count = await connection.ExecuteScalarAsync<int>(sql, new { UserId = userId, Name = name, Date = date });
        return count > 0;
    }
    // CREATE: Saving the entire tree in one go
    public async Task<bool> CreateFullWorkoutAsync(Workout workout)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            // A. Insert Workout (Parent)
            string sqlWorkout = @"
                INSERT INTO workouts (id, user_id, name, date) 
                VALUES (@Id, @UserId, @Name, @Date)";
            
            await connection.ExecuteAsync(sqlWorkout, workout, transaction);

            // Helper function to insert children (avoids code duplication with Update)
            await InsertChildrenAsync(connection, transaction, workout);

            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            throw;
        }
    }

    // UPDATE: Wipes old children and saves the new version
    public async Task<bool> UpdateFullWorkoutAsync(Workout workout)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            // 🔒 Security: AND user_id = @UserId
            string sqlUpdate = @"
                UPDATE workouts 
                SET name = @Name, date = @Date 
                WHERE id = @Id AND user_id = @UserId";

            var rowsAffected = await connection.ExecuteAsync(sqlUpdate, workout, transaction);
            if (rowsAffected == 0) return false;

            // Delete old children
            await connection.ExecuteAsync(
                "DELETE FROM exercises_log WHERE workout_id = @Id", 
                new { Id = workout.Id }, transaction);

            // Re-insert children
            await InsertChildrenAsync(connection, transaction, workout);

            transaction.Commit();
            return true;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    // Override the generic delete to add security
    public async Task<bool> DeleteOwnedAsync(Guid id, Guid userId)
    {
        using var connection = CreateConnection();
        var count = await connection.ExecuteAsync(
            "DELETE FROM workouts WHERE id = @Id AND user_id = @UserId", 
            new { Id = id, UserId = userId });
        return count > 0;
    }
    
    // HELPER: Keeps the logic DRY (Don't Repeat Yourself)
    private async Task InsertChildrenAsync(System.Data.IDbConnection connection, System.Data.IDbTransaction transaction, Workout workout)
    {
        // B. Insert Exercises
        foreach (var exercise in workout.Exercises)
        {
            exercise.WorkoutId = workout.Id; // Ensure link

            string sqlExercise = @"
                INSERT INTO exercises_log (id, workout_id, name, position) 
                VALUES (@Id, @WorkoutId, @Name, @Position)";
            
            await connection.ExecuteAsync(sqlExercise, exercise, transaction);

            // C. Insert Sets
            foreach (var set in exercise.Sets)
            {
                set.ExerciseId = exercise.Id; // Ensure link
                
                string sqlSet = @"
                    INSERT INTO sets (id, exercise_id, set_number) 
                    VALUES (@Id, @ExerciseId, @SetNumber)";
                
                await connection.ExecuteAsync(sqlSet, set, transaction);

                // D. Insert Reps
                foreach (var rep in set.Reps)
                {
                    rep.SetId = set.Id; // Ensure link

                    string sqlRep = @"
                        INSERT INTO reps_log (id, set_id, weight, rep_number) 
                        VALUES (@Id, @SetId, @Weight, @RepNumber)";
                    
                    await connection.ExecuteAsync(sqlRep, rep, transaction);
                }
            }
        }
    }
}