using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PC.Database
{
    public class DatabaseContextDesignTimeFactory : IDesignTimeDbContextFactory<DatabaseContext>
    {
        public DatabaseContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(new DirectoryInfo("../Company.Core.Api").FullName)
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json")
                .AddEnvironmentVariables()
                .Build();

            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            System.Console.WriteLine(connectionString);
            builder.UseNpgsql(connectionString);

            return new DatabaseContext(builder.Options);
        }
    }
}