using Dapper;
using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Repositories;

// Inherit from BaseRepository<User> and implement the Interface
public class UserRepository : BaseRepository<User>, IUserRepository
{
    // Pass the table name "users" to the parent
    public UserRepository(IConfiguration config) : base(config, "users")
    {
    }

    public async Task<Guid> CreateAsync(User user)
    {
        using var connection = CreateConnection();
        var sql = "INSERT INTO users (email) VALUES (@Email) RETURNING id";
        return await connection.ExecuteScalarAsync<Guid>(sql, user);
    }

    public async Task<bool> UpdateAsync(User user)
    {
        using var connection = CreateConnection();
        var sql = "UPDATE users SET email = @Email WHERE id = @Id";
        return await connection.ExecuteAsync(sql, user) > 0;
    }
}