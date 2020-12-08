using Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Core.Api.Config
{
    public static class DatabaseConfig
    {
        public static void Setup(IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
        {
            services
                .AddDbContext<DatabaseContext>(options =>
                {
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

                    options.ConfigureWarnings(w =>
                    {
                        if (!environment.IsDevelopment())
                        {
                            // https://www.thinktecture.com/en/entity-framework-core/cartesian-explosion-problem-in-3-1/
                            // https://docs.microsoft.com/en-us/ef/core/querying/single-split-queries
                            w.Ignore(RelationalEventId.MultipleCollectionIncludeWarning);
                        }
                    });
                });
        }
    }
}