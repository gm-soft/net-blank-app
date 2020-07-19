using IdentityServer4;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Company.IdentityServer.Extensions
{
    internal static class AuthExtensions
    {
        internal static IServiceCollection AddGoogleAuth(this IServiceCollection services, IConfiguration configuration)
        {
            IConfigurationSection googleAuthNSection = configuration.GetSection("Authentication:Google");

            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.ClientId = googleAuthNSection["ClientId"];
                    options.ClientSecret = googleAuthNSection["ClientSecret"];
                    options.SaveTokens = true;
                });

            return services;
        }
    }
}