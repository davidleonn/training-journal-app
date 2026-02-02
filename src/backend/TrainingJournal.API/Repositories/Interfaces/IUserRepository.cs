using TrainingJournal.API.Models;

namespace TrainingJournal.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> DeleteAsync(Guid id);
}