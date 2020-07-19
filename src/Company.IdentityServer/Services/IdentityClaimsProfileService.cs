using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using PC.Database.Models.Users;
using Utils.Authorization;

namespace Company.IdentityServer.Services
{
    public class IdentityClaimsProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<DbUser> _claimsFactory;
        private readonly UserManager<DbUser> _userManager;

        public IdentityClaimsProfileService(
            UserManager<DbUser> userManager,
            IUserClaimsPrincipalFactory<DbUser> claimsFactory)
        {
            _userManager = userManager;
            _claimsFactory = claimsFactory;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();
            DbUser user = await _userManager.FindByIdAsync(sub);
            IReadOnlyCollection<string> roles = (await _userManager.GetRolesAsync(user)).ToArray();
            var principal = await _claimsFactory.CreateAsync(user);

            var claims = principal
                .Claims
                .Where(claim => context.RequestedClaimTypes.Contains(claim.Type))
                .ToList();

            AddClaims(claims, user, roles);

            context.IssuedClaims = claims;
        }

        private void AddClaims(ICollection<Claim> claims, DbUser user, IReadOnlyCollection<string> roles)
        {
            claims.Add(new Claim(JwtClaimTypes.GivenName, user.FirstName));
            claims.Add(new Claim(JwtClaimTypes.FamilyName, user.LastName));
            claims.Add(new Claim(JwtClaimTypes.Email, user.Email));
            claims.Add(new Claim(type: JwtClaimTypes.NickName, value: user.UserName));

            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(IdentityServerConstants.StandardScopes.Email, user.Email));

            claims.Add(new Claim(CustomClaimTypes.FirstName, user.FirstName));
            claims.Add(new Claim(CustomClaimTypes.LastName, user.LastName));
            claims.Add(new Claim(CustomClaimTypes.Username, user.UserName));

            claims.Add(new Claim(ClaimTypes.GivenName, user.FirstName));
            claims.Add(new Claim(ClaimTypes.Surname, user.LastName));

            // note: to dynamically add roles (ie. for users other than consumers - simply look them up by sub id
            // need this for role-based authorization
            // https://stackoverflow.com/questions/40844310/role-based-authorization-with-identityserver4
            claims.Add(new Claim(type: ClaimTypes.Role, value: roles.FirstOrDefault()));
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            context.IsActive = user != null;
        }
    }
}