using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Utils.Enums;

namespace Utils.Helpers
{
    public static class ClaimHelper
    {
        public static Role Role(this ClaimsPrincipal principal)
        {
            return principal
                .GetClaimValue(ClaimTypes.Role)
                .ToEnum<Role>();
        }

        public static string GetClaimValue(this ClaimsPrincipal principal, string type, bool throwExIfNotFound = true)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(paramName: nameof(principal));
            }

            return principal.Claims.GetClaimValue(type, throwExIfNotFound);
        }

        public static string GetClaimValue(this IEnumerable<Claim> claims, string type, bool throwExIfNotFound = true)
        {
            if (string.IsNullOrEmpty(type))
            {
                throw new ArgumentNullException(paramName: nameof(type));
            }

            if (claims == null)
            {
                throw new ArgumentNullException(paramName: nameof(claims));
            }

            Claim claim = claims.FirstOrDefault(x => x.Type == type);

            if (claim == null && throwExIfNotFound)
            {
                throw new InvalidOperationException($"Cannot find claim value for type '{type}'");
            }

            return claim?.Value;
        }
    }
}