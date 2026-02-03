using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services.Interfaces;

namespace TrainingJournal.API.Services;

public class AuthService(IUserRepository userRepository) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<User?> VerifyUserExistsAsync(string email)
    {
        // 1. Validation: Throw ArgumentException (triggers 400 Bad Request via GlobalHandler)
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email cannot be empty.");
        }

        // 2. Execution: If DB fails, NpgsqlException is thrown (triggers 503 Service Unavailable)
        return await _userRepository.GetByEmailAsync(email);
    }
}