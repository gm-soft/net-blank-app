using System;
using IdentityServer.Infrastructure.Consumers.Kafka;
using IdentityServer.Infrastructure.Services;
using IdentityServer.Infrastructure.Services.Http;
using IdentityServer.Infrastructure.Services.User;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Utils.Validators;
using Web.Health;
using Web.MessageBrokers.Kafka;

namespace IdentityServer.Config
{
    public static class StartupExtensions
    {
        public static void Migrate(this IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            using var service = serviceScope.ServiceProvider.GetRequiredService<DatabaseContext>();
            try
            {
                service.Database.Migrate();
            }
            catch (Exception exception)
            {
                throw new InvalidOperationException(
                    "\r\n\r\nCannot migrate Identity Server database\r\n\r\n", exception);
            }
        }

        public static IServiceCollection HealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddTransient<DatabaseHealthCheck>()
                .AddHealthChecks()
                .AddCheck<DatabaseHealthCheck>("Database")
                .AddKafka(new AppKafkaOptions(configuration).ProducerConfig());

            return services;
        }

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddScoped<IProfileService, ProfileService>()
                .AddScoped<IUserClaimsProvider, UserClaimsProvider>()
                .AddScoped<IUserIdentityService, UserIdentityService>()
                .AddScoped<IUserServiceForIdentityServer, UserServiceForIdentityServer>()
                .AddTransient<AppKafkaOptions>()
                .AddConsumer<UserCreateKafkaConsumer>()
                .AddConsumer<UserUpdateKafkaConsumer>()
                .AddConsumer<UsersImportKafkaConsumer>()
                .AddConsumer<UserDeleteConsumer>()
                .AddConsumer<UserRemoveConsumer>();

            services.AddTransient(c => new EmailDomainValidatorService(configuration["AllowedDomainEmails:Domains"]?.Trim()));

            return services;
        }
    }
}