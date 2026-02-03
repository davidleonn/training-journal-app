namespace TrainingJournal.API.Core.Interfaces;

// 1. Define the wrapper (if you haven't already)
public record AuthResult(string Token, int Expires);

public interface ITokenService
{
    // 2. Change 'string' to 'AuthResult'
    AuthResult CreateToken(string email, string userId);
}