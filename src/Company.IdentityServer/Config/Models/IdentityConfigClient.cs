using System.Collections.Generic;
using System.Linq;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using Utils.Helpers;

namespace Company.IdentityServer.Config.Models
{
    public class IdentityConfigClient
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public IReadOnlyCollection<string> ClientSecrets { get; set; }

        public IReadOnlyCollection<string> AllowedScopes { get; set; }

        public IReadOnlyCollection<string> RedirectUris { get; set; }

        public IReadOnlyCollection<string> PostLogoutRedirectUris { get; set; }

        public IReadOnlyCollection<string> AllowedCorsOrigins { get; set; }

        public bool Valid()
        {
            return !Id.NullOrEmpty() &&
                   !Name.NullOrEmpty() &&
                   !ClientSecrets.IsNullOrEmpty() &&
                   !AllowedScopes.IsNullOrEmpty() &&
                   !RedirectUris.IsNullOrEmpty() &&
                   !PostLogoutRedirectUris.IsNullOrEmpty() &&
                   !AllowedCorsOrigins.IsNullOrEmpty();
        }

        public override string ToString()
        {
            return $"{nameof(IdentityConfigClient)} {Name}";
        }

        public Client Client(
            bool requireConsent = false,
            bool allowAccessTokensViaBrowser = true,
            int accessTokenLifetime = 3600)
        {
            var client = new Client
            {
                RequireConsent = requireConsent,
                ClientId = Id,
                ClientName = Name,
                ClientSecrets = new List<Secret>(),
                AllowedGrantTypes = GrantTypes.Implicit,
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
                },
                RedirectUris = RedirectUris.ToList(),
                PostLogoutRedirectUris = PostLogoutRedirectUris.ToList(),
                AllowedCorsOrigins = AllowedCorsOrigins.ToList(),
                AllowAccessTokensViaBrowser = allowAccessTokensViaBrowser,
                AccessTokenLifetime = accessTokenLifetime
            };

            foreach (string clientSecret in ClientSecrets)
            {
                client.ClientSecrets.Add(new Secret(clientSecret));
            }

            foreach (string allowedScope in AllowedScopes)
            {
                client.AllowedScopes.Add(allowedScope);
            }

            return client;
        }
    }
}