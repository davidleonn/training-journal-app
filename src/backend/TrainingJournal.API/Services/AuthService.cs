using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services.Interfaces;

namespace TrainingJournal.API.Services;

public class AuthService(IUserRepository userRepository) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<User?> VerifyUserExistsAsync(string email)
    {
        return await _userRepository.GetByEmailAsync(email);
    }
}