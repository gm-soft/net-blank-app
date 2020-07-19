using Company.IdentityServer.Services;
using Company.IdentityServer.Services.User;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PC.BL.Database;
using PC.Database.Repositories.Users;
using PC.Services.Auth;
using PC.Services.User;
using Utils.AsyncUtils;

namespace Company.IdentityServer.Config
{
    public static class StartupExtensions
    {
        public static void WaitForDatabase(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var service = serviceScope.ServiceProvider.GetRequiredService<DatabaseConnectAwaiter>();
                new AsyncOperationAsSync(async () => await service.ExecuteAsync()).Execute();
            }
        }

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddTransient<DatabaseConnectAwaiter>();

            services.AddTransient<IProfileService, IdentityClaimsProfileService>();
            services.AddScoped<IUserIdentityService, UserIdentityService>();

            services.AddScoped<IUserClaimsProvider, UserClaimsProvider>();
            services.AddScoped<IAuthorizationManager, AuthorizationManager>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserServiceForIdentityServer, UserServiceForIdentityServer>();
            services.AddTransient(c => new EmailDomainValidatorService(configuration["AllowedDomainEmails:Domains"]?.Trim()));

            return services;
        }
    }
}