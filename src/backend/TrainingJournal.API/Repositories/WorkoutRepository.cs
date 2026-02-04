using Dapper;
using TrainingJournal.Api.Models;
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Repositories;

public class WorkoutRepository : BaseRepository<Workout>, IWorkoutRepository
{
    public WorkoutRepository(IConfiguration config) : base(config, "workouts")
    {
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
            // 1. Update the Main Workout Details
            string sqlUpdate = @"
                UPDATE workouts 
                SET name = @Name, date = @Date 
                WHERE id = @Id";

            var rowsAffected = await connection.ExecuteAsync(sqlUpdate, workout, transaction);
            if (rowsAffected == 0) return false; // Workout didn't exist

            // 2. Nuke the old children (Exercises). 
            // Postgres 'ON DELETE CASCADE' will automatically remove the Sets and Reps linked to these exercises.
            string sqlDeleteChildren = "DELETE FROM exercises_log WHERE workout_id = @Id";
            await connection.ExecuteAsync(sqlDeleteChildren, new { Id = workout.Id }, transaction);

            // 3. Re-insert the fresh tree
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