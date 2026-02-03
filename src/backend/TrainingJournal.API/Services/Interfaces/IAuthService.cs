using TrainingJournal.API.Models;

namespace TrainingJournal.API.Services.Interfaces;

public interface IAuthService
{
    Task<User?> VerifyUserExistsAsync(string email);
}