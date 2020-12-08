using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using PC.Models.Users;
using Utils.Authorization;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;
using Utils.ValueObjects;

namespace PC.Models.Records.Users
{
    public class IdentityUser : IHasUserData
    {
        public IdentityUser(ClaimsPrincipal principal)
        {
            principal.ThrowIfNull(nameof(principal));

            IReadOnlyCollection<Claim> claims = principal.Claims.ToArray();

            Id = new Long(claims.GetClaimValue(ClaimTypes.NameIdentifier)).Value();
            FirstName = claims.GetClaimValue(ClaimTypes.GivenName);
            LastName = claims.GetClaimValue(ClaimTypes.Surname);
            UserName = claims.GetClaimValue(CustomClaimTypes.Username);
            Email = claims.GetClaimValue(ClaimTypes.Email);
            EmailConfirmed = bool.Parse(claims.GetClaimValue(CustomClaimTypes.EmailConfirmed));

            Role = claims.RoleOrFail();
        }

        public IdentityUser(int id, string firstName, string lastName, string email, Role role, bool emailConfirmed)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            UserName = email;
            Role = role;
            EmailConfirmed = emailConfirmed;
        }

        public long Id { get; }

        public string FirstName { get; }

        public string LastName { get; }

        public string UserName { get; }

        public string Email { get; }

        public Role Role { get; }

        public bool EmailConfirmed { get; }

        public User Create()
        {
            return new User(
                identityId: Id,
                firstName: FirstName,
                lastName: LastName,
                userName: UserName,
                role: Role,
                emailConfirmed: EmailConfirmed);
        }
    }
}