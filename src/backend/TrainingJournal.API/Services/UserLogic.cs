using System.Text.RegularExpressions;
using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Services;

public class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> RegisterUserAsync(User user)
    {
        // 1. Validation Logic: Don't allow empty emails
        if (string.IsNullOrWhiteSpace(user.Email))
        {
            throw new ArgumentException("Email is required.");
        }

        string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        if (!Regex.IsMatch(user.Email, emailPattern))
        {
            throw new ArgumentException($"'{user.Email}' is not a valid email address.");
        }

        // 2. Business Logic: Check for duplicates before hitting DB
        // This prevents the "500 Internal Server Error" crash
        var existingUser = await _repository.GetByEmailAsync(user.Email);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("User already exists.");
        }

        // 3. Database Call: All clear, save the user
        return await _repository.CreateAsync(user);
    }
}