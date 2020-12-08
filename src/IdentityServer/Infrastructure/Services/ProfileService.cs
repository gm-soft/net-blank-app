using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer.Infrastructure.Services.User;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Utils.Authorization;
using UserWithRole = IdentityServer.Database.Models.UserWithRole;

namespace IdentityServer.Infrastructure.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<Database.Models.User> _claimsFactory;
        private readonly IUserServiceForIdentityServer _identityServer;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProfileService(
            IUserClaimsPrincipalFactory<Database.Models.User> claimsFactory, IUserServiceForIdentityServer identityServer, IHttpContextAccessor httpContextAccessor)
        {
            _claimsFactory = claimsFactory;
            _httpContextAccessor = httpContextAccessor;
            _identityServer = identityServer;
        }

        private long FetchUserId(ClaimsPrincipal principal)
        {
            string sub = principal.GetSubjectId();
            if (!long.TryParse(sub, out long userId))
            {
                throw new InvalidOperationException($"It is not able to parse '{sub}' as long type");
            }

            return userId;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            context.IssuedClaims = await GetIssueClaimsAsync(
                userId: FetchUserId(context.Subject),
                requestedClaimTypes: context.RequestedClaimTypes.ToArray());
        }

        private async Task<List<Claim>> GetIssueClaimsAsync(long userId, IReadOnlyCollection<string> requestedClaimTypes)
        {
            UserWithRole user = await _identityServer.UserOrFailAsync(userId);

            var principal = await _claimsFactory.CreateAsync(user.User);

            List<Claim> claims = principal
                .Claims
                .Where(claim => requestedClaimTypes.Contains(claim.Type))
                .ToList();

            return AddClaims(claims, user);
        }

        private List<Claim> AddClaims(List<Claim> claims, UserWithRole user)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.User.Id.ToString()));

            claims.Add(new Claim(JwtClaimTypes.GivenName, user.User.FirstName));
            claims.Add(new Claim(JwtClaimTypes.FamilyName, user.User.LastName));
            claims.Add(new Claim(JwtClaimTypes.Email, user.User.Email));
            claims.Add(new Claim(type: JwtClaimTypes.NickName, value: user.User.UserName));

            claims.Add(new Claim(ClaimTypes.Email, user.User.Email));
            claims.Add(new Claim(IdentityServerConstants.StandardScopes.Email, user.User.Email));

            claims.Add(new Claim(CustomClaimTypes.FirstName, user.User.FirstName));
            claims.Add(new Claim(CustomClaimTypes.LastName, user.User.LastName));
            claims.Add(new Claim(CustomClaimTypes.Username, user.User.UserName));

            claims.Add(new Claim(ClaimTypes.GivenName, user.User.FirstName));
            claims.Add(new Claim(ClaimTypes.Surname, user.User.LastName));

            // note: to dynamically add roles (ie. for users other than consumers - simply look them up by sub id
            // need this for role-based authorization
            // https://stackoverflow.com/questions/40844310/role-based-authorization-with-identityserver4
            claims.Add(new Claim(type: ClaimTypes.Role, value: user.Role.ToString()));

            var loggedInAsAnotherUser = _httpContextAccessor.HttpContext.Session.GetInt32(CustomClaimTypes.LoggedInAsAnotherPerson);
            if (loggedInAsAnotherUser != null)
            {
                claims.Add(new Claim(CustomClaimTypes.EmailConfirmed, false.ToString(), ClaimValueTypes.Boolean));
                claims.Add(new Claim(CustomClaimTypes.LoggedInAsAnotherPerson, true.ToString(), ClaimValueTypes.Boolean));
                _httpContextAccessor.HttpContext.Session.Remove(CustomClaimTypes.LoggedInAsAnotherPerson);
            }
            else
            {
                claims.Add(new Claim(CustomClaimTypes.EmailConfirmed, true.ToString(), ClaimValueTypes.Boolean));
            }

            return claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = await _identityServer.HasEntityAsync(FetchUserId(context.Subject));
        }
    }
}