using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PC.Database
{
    public class DatabaseContextDesignTimeFactory : IDesignTimeDbContextFactory<DatabaseContext>
    {
        // TODO Maxim: load connection string from settings
        private const string ConnectionString =
            "Server=localhost;Database=companycore;Trusted_Connection=False;MultipleActiveResultSets=true;User ID=SA;Password=StrongPassword";

        public DatabaseContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
            optionsBuilder.UseSqlServer(ConnectionString);
            return new DatabaseContext(optionsBuilder.Options);
        }
    }
}