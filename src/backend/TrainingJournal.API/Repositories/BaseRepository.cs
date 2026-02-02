using Dapper;
using Npgsql;
namespace TrainingJournal.API.Repositories;

public abstract class BaseRepository<T>
{
    private readonly string _connectionString;
    private readonly string _tableName;

    // We ask for the Config AND the Table Name
    protected BaseRepository(IConfiguration config, string tableName)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
        _tableName = tableName;
    }

    // Helper for children to get a connection
    protected NpgsqlConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    // GENERIC READ: Works for User, Workout, Exercise...
    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        using var connection = CreateConnection();
        return await connection.QueryAsync<T>($"SELECT * FROM {_tableName}");
    }

    // GENERIC READ BY ID
    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<T>(
            $"SELECT * FROM {_tableName} WHERE id = @Id", new { Id = id });
    }

    // GENERIC DELETE (Optional, if you want it)
    public virtual async Task<bool> DeleteAsync(Guid id)
    {
        using var connection = CreateConnection();
        var count = await connection.ExecuteAsync(
            $"DELETE FROM {_tableName} WHERE id = @Id", new { Id = id });
        return count > 0;
    }
}