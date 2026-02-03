using TrainingJournal.API.Models;

namespace TrainingJournal.API.Contracts;

public record LoginResponse(string Token, int Expires);