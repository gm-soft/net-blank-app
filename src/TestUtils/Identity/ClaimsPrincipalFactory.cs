using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace TestUtils.Identity
{
    public class ClaimsPrincipalFactory
    {
        private readonly ICollection<Claim> _claims;

        public ClaimsPrincipalFactory(params Claim[] claims)
        {
            _claims = claims.Any()
                ? claims.ToList()
                : new List<Claim>();
        }

        public ClaimsPrincipal Build()
        {
            return new ClaimsPrincipal(new ClaimsIdentity(_claims));
        }

        public ClaimsPrincipalFactory AddClaim(string key, string value)
        {
            _claims.Add(new Claim(key, value));

            return this;
        }
    }
}