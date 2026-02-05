using TrainingJournal.Api.Models;

namespace TrainingJournal.API.Repositories.Interfaces;

public interface IWorkoutRepository
{
    Task<IEnumerable<Workout>> GetAllByUserIdAsync(Guid userId);
    Task<Workout?> GetOwnedByIdAsync(Guid id, Guid userId);
    Task<bool> DeleteOwnedAsync(Guid id, Guid userId); 
    
    Task<bool> ExistsAsync(Guid userId, string name, DateTimeOffset date);
    Task<bool> CreateFullWorkoutAsync(Workout workout);
    Task<bool> UpdateFullWorkoutAsync(Workout workout);
}