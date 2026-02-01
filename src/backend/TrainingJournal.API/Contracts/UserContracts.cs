namespace TrainingJournal.API.Contracts;

// 1. What the client sends to create a user
// We only ask for what we actually need.
public record CreateUserRequest(string Email);

// 2. What we return to the client (The "Public" view of a user)
// This is useful if you later add a "PasswordHash" to the database model
// but never want to send it back to the frontend.
public record UserResponse(Guid Id, string Email, DateTime CreatedAt);