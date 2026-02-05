using TrainingJournal.API.Contracts;

namespace TrainingJournal.API.Services.Interfaces;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutSummaryResponse>> GetAllSummariesAsync(Guid userId);
    Task<WorkoutResponse?> GetByIdAsync(Guid id, Guid userId);
    Task<WorkoutResponse> CreateAsync(CreateWorkoutRequest request, Guid userId);
    Task<bool> UpdateAsync(Guid id, UpdateWorkoutRequest request, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}