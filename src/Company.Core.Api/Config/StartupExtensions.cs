using System.Security.Claims;
using Company.Core.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PC.BL.Database;
using PC.Database.Repositories.Users;
using PC.Services.Auth;
using PC.Services.Email;
using PC.Services.User;
using SendGrid;
using Utils.Enums;
using Utils.Interfaces;

namespace Company.Core.Api.Config
{
    public static class StartupExtensions
    {
        public static void MigrateOrFail(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetRequiredService<DatabaseMigration>().Execute();
            }
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

        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            // for resolving IHttpContextAccessor
            services.AddHttpContextAccessor();

            services.AddTransient<DatabaseMigration>();

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IUserClaimsProvider, UserClaimsProvider>();
            services.AddScoped<IAuthorizationManager, AuthorizationManager>();
            services.AddRazorPages();

            services
                .AddTransient<ISendGridClient>(c => new SendGridClient(configuration["SendGridApiKey"]))
                .AddScoped<IBaseUrls, BaseUrls>()
                .AddTransient<IEmailSender, EmailSender>()
                .AddScoped<IViewRenderer, ViewRenderer>();

            var allowedDomainsForUserImport = configuration["AllowedDomainEmails:Domains"]?.Trim();
            services.AddTransient(c => new EmailDomainValidatorService(allowedDomainsForUserImport));

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
                        "Company.Core.Api",
                        p => p.RequireClaim("scope", "company.core.api"));
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