using System;
using System.Collections.Generic;
using System.Linq;
using Company.IdentityServer.Config.Models;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PC.Database;
using PC.Database.Models.Users;

namespace Company.IdentityServer.Config
{
    public static class IdentityServerExtensions
    {
        public static IServiceCollection AddIdentityServerSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddIdentity<DbUser, DbIdentityRole>()
                .AddEntityFrameworkStores<DatabaseContext>()
                .AddDefaultTokenProviders();

            var serverOptions = configuration
                .GetSection("IdentityServerOptions")
                .Get<Models.IdentityServerOptions>()
                .ThrowIfInvalid();

            // https://github.com/IdentityServer/IdentityServer4/issues/2909#issuecomment-455272877
            services.AddIdentityServer(options =>
                {
                    options.UserInteraction.LoginUrl = serverOptions.LoginUrl;
                    options.UserInteraction.LogoutUrl = serverOptions.LogoutUrl;
                    options.UserInteraction.LoginReturnUrlParameter = serverOptions.LoginReturnUrlParameter;

                    options.Events.RaiseErrorEvents = serverOptions.RaiseErrorEvents;
                    options.Events.RaiseFailureEvents = serverOptions.RaiseFailureEvents;
                    options.Events.RaiseInformationEvents = serverOptions.RaiseInformationEvents;
                    options.Events.RaiseSuccessEvents = serverOptions.RaiseSuccessEvents;
                })
                .AddDeveloperSigningCredential()
                .AddInMemoryPersistedGrants()
                .AddInMemoryIdentityResources(GetIdentityResources())
                .AddInMemoryApiResources(GetApiResources(configuration))
                .AddInMemoryClients(GetClients(configuration))
                .AddAspNetIdentity<DbUser>();

            services.AddAuthentication(IdentityConstants.ApplicationScheme);

            return services;
        }

        private static IEnumerable<IdentityResource> GetIdentityResources()
        {
            yield return new IdentityResources.OpenId();
            yield return new IdentityResources.Email();
            yield return new IdentityResources.Profile();
        }

        public static IEnumerable<ApiResource> GetApiResources(IConfiguration configuration)
        {
            var resources = configuration
                .GetSection("ApiResources")
                .Get<IReadOnlyCollection<ConfigApiResource>>();

            if (resources.Any(x => !x.Valid()))
            {
                throw new InvalidOperationException("There are invalid api resources");
            }

            return resources.Select(x => x.ApiResource());
        }

        public static IEnumerable<Client> GetClients(IConfiguration configuration)
        {
            var clients = configuration
                .GetSection("IdentityClients")
                .Get<IReadOnlyCollection<IdentityConfigClient>>();

            if (clients.Any(x => !x.Valid()))
            {
                throw new InvalidOperationException("There are invalid client settings");
            }

            return clients.Select(x => x.Client());
        }
    }
}