using System.Data.Common;
using System.Threading.Tasks;
using IdentityServer;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace IdentityServerTest.Utils
{
    // https://docs.microsoft.com/en-us/ef/core/testing/sqlite#using-sqlite-in-memory-databases
    public class IdentitySqliteContext : DatabaseContext
    {
        private readonly DbConnection _connection;

        public IdentitySqliteContext()
            : base(new DbContextOptionsBuilder<DatabaseContext>()
                .UseSqlite(new SqliteConnection("Filename=:memory:"))
                .EnableSensitiveDataLogging()
                .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options)
        {
            _connection = Database.GetDbConnection();
            _connection.Open();

            Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        public override void Dispose()
        {
            Database.EnsureDeleted();
            _connection?.Dispose();
            base.Dispose();
        }

        public override async ValueTask DisposeAsync()
        {
            await Database.EnsureDeletedAsync();
            await _connection.DisposeAsync();
            await base.DisposeAsync();
        }
    }
}