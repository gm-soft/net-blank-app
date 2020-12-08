using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Utils.Authorization;
using Utils.Exceptions;
using Utils.Helpers;

namespace IdentityServer.Infrastructure.Services.Claims
{
    public class GoogleClaims : IEnumerable<Claim>
    {
        private ICollection<Claim> _claims;

        public GoogleClaims(ClaimsPrincipal principal)
        {
            principal.ThrowIfNull(nameof(principal));
            _claims = principal.Claims.ToList();

            GivenName = _claims.GetClaimValue(ClaimTypes.GivenName);
            Surname = _claims.GetClaimValue(ClaimTypes.Surname);
            Email = _claims.GetClaimValue(ClaimTypes.Email);
            Identifier = _claims.GetClaimValue(ClaimTypes.NameIdentifier);
        }

        public string GivenName { get; }

        public string Surname { get; }

        public string Email { get; }

        public string Identifier { get; }

        public void HasEmailOrFail()
        {
            // try to determine the unique id of the external user - the most common claim type for that are the sub claim and the NameIdentifier
            // depending on the external provider, some other claim type might be used
            if (Email == null)
            {
                throw new ResourceNotFoundException("Unknown userid");
            }
        }

        public GoogleClaims ReadUser(Database.Models.User user)
        {
            user.ThrowIfNull(nameof(user));

            _claims.Add(new Claim(CustomClaimTypes.Username, user.UserName));
            _claims.Add(new Claim(ClaimTypes.Role, user.Role.ToString()));

            _claims = _claims.Where(x => x.Type != ClaimTypes.NameIdentifier).ToList();
            _claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));

            return this;
        }

        public IEnumerator<Claim> GetEnumerator()
        {
            return _claims.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}