using System.Collections.Generic;
using System.Security.Claims;
using PC.Database.Models.Users;
using Utils.Authorization;
using Utils.Helpers;

namespace Company.IdentityServer.Extensions
{
    public static class ClaimsExtensions
    {
        public static IReadOnlyCollection<Claim> Claims(this DbUser user, string role)
        {
            user.ThrowIfNull(nameof(user));
            role.ThrowIfNullOrEmpty(nameof(role));

            return new List<Claim>
            {
                new Claim(CustomClaimTypes.Username, user.UserName),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            };
        }
    }
}