using TrainingJournal.Api.Models;

namespace TrainingJournal.API.Repositories.Interfaces;

public interface IWorkoutRepository
{
    // Standard CRUD (Provided by BaseRepository)
    Task<IEnumerable<Workout>> GetAllAsync();
    Task<Workout?> GetByIdAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateFullWorkoutAsync(Workout workout);
    Task<bool> CreateFullWorkoutAsync(Workout workout);
}