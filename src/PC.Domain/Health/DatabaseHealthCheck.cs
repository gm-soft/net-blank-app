using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;
using Utils.Helpers;

namespace PC.Domain.Health
{
    public class DatabaseHealthCheck : IHealthCheck
    {
        private const string DefaultTestQuery = "Select 1";

        private readonly string _connectionString;

        public DatabaseHealthCheck(IConfiguration configuration)
        {
            configuration.ThrowIfNull(nameof(configuration));

            _connectionString = configuration.GetSection("ConnectionStrings")["DefaultConnection"];
        }

        // Was copied from
        // https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/monitor-app-health
        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync(cancellationToken);

                    var command = connection.CreateCommand();
                    command.CommandText = DefaultTestQuery;

                    await command.ExecuteNonQueryAsync(cancellationToken);
                }
                catch (DbException ex)
                {
                    return new HealthCheckResult(status: context.Registration.FailureStatus, exception: ex);
                }
            }

            return HealthCheckResult.Healthy();
        }
    }
}