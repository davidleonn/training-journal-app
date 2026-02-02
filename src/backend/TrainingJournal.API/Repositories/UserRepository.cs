using Dapper;
using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;

namespace TrainingJournal.API.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(IConfiguration config) : base(config, "users")
    {
    }

    public async Task<Guid> CreateAsync(User user)
    {
        using var connection = CreateConnection();
        var sql = "INSERT INTO users (email, created_at) VALUES (@Email, @CreatedAt) RETURNING id";
        return await connection.ExecuteScalarAsync<Guid>(sql, user);
    }

    public override async Task<IEnumerable<User>> GetAllAsync()
    {
        using var connection = CreateConnection();
        // Correct: Maps 'created_at' to 'CreatedAt'
        var sql = "SELECT id, email, created_at AS CreatedAt FROM users";
        return await connection.QueryAsync<User>(sql);
    }

    public override async Task<User?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();
        var sql = "SELECT id, email, created_at AS CreatedAt FROM users WHERE id = @Id";
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        // Use your helper method to open a connection
        using var connection = CreateConnection();

        // Use explicit column mapping (AS CreatedAt) to match your User model
        string sql = "SELECT id, email, created_at AS CreatedAt FROM users WHERE email = @Email";

        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
    }

}