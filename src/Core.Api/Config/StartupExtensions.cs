using System;
using System.Security.Claims;
using Core.Api.Services;
using Database;
using Database.Repositories.Users;
using Domain.Emails;
using Domain.Emails.Clients;
using Domain.Services.Auth;
using Domain.Services.Users;
using Domain.Services.Users.Email;
using Domain.Services.Users.MessageBrokers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Utils.Enums;
using Utils.Interfaces;
using Utils.Validators;
using Web.Health;
using Web.MessageBrokers.Kafka;

namespace Core.Api.Config
{
    public static class StartupExtensions
    {
        public static void MigrateOrFail(this IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            using var context = serviceScope.ServiceProvider.GetRequiredService<DatabaseContext>();
            try
            {
                context.Database.Migrate();
            }
            catch (Exception exception)
            {
                throw new InvalidOperationException("Cannot migrate database", exception);
            }
        }

        public static IServiceCollection HealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddTransient<DatabaseHealthCheck>()
                .AddHealthChecks()
                .AddCheck<DatabaseHealthCheck>("Database");

            return services;
        }

        public static IServiceCollection AddJwtAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    // base-address of your identityserver
                    options.Authority = configuration.GetSection("IdentityServer")["Authority"];

                    // name of the API resource
                    options.Audience = configuration.GetSection("IdentityServer")["Audience"];

                    options.RequireHttpsMetadata = false;
                });

            return services;
        }

        public static IServiceCollection AddServices(
            this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
        {
            // for resolving IHttpContextAccessor
            services.AddHttpContextAccessor();
            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserEvent, RabbitUserEvent>();

            services.AddScoped<IUserClaimsProvider, UserClaimsProvider>();
            services.AddScoped<IAuthorizationManager, Authorization>();
            services.AddRazorPages();

            services
                .AddScoped<IBaseUrls, BaseUrls>()
                .AddScoped<IViewRenderer, ViewRenderer>()
                .AddScoped<IUserEmail, UserEmail>()
                .AddScoped<IEmailPreviewService, EmailPreviewService>();

            if (environment.IsDevelopment())
            {
                services.AddScoped<IEmailSender, LocalEmailSender>();
            }
            else
            {
                services.AddScoped<IEmailSender, SendGridEmailSender>();
            }

            var allowedDomainsForUserImport = configuration["AllowedDomainEmails:Domains"]?.Trim();
            services.AddTransient(c => new EmailDomainValidatorService(allowedDomainsForUserImport));

            services.AddScoped<IEmailService, EmailService>();

            services
                .AddTransient<AppKafkaOptions>()
                .AddScoped<IProducer, KafkaProducer>();

            return services;
        }

        public static IServiceCollection AddClaimPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                // TODO Maxim: add string values to Utils constants
                options
                    .AddRolePolicy(Role.Employee)
                    .AddRolePolicy(Role.HRManager)
                    .AddRolePolicy(Role.TopManager)
                    .AddRolePolicy(Role.SystemAdministrator)
                    .AddRolePolicy(Role.System)
                    .AddPolicy(
                        "Core.Api",
                        p => p.RequireClaim("scope", "core.api"));
            });

            return services;
        }

        private static AuthorizationOptions AddRolePolicy(this AuthorizationOptions options, Role role)
        {
            options.AddPolicy(
                role.ToString(),
                policy => policy.RequireClaim(ClaimTypes.Role, role.ToString()));

            return options;
        }
    }
}