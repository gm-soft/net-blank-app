using System;
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
using PC.Database.Repositories.Dto;
using PC.Database.Repositories.Users;
using Utils.Authorization;

namespace Company.IdentityServer.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<DbUser> _claimsFactory;
        private readonly IUserRepositoryForIdentity _userRepository;

        public ProfileService(
            IUserClaimsPrincipalFactory<DbUser> claimsFactory, IUserRepositoryForIdentity userRepository)
        {
            _claimsFactory = claimsFactory;
            _userRepository = userRepository;
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
            UserWithRole user = await _userRepository.UserWithRoleOrFailAsync(FetchUserId(context.Subject));

            var principal = await _claimsFactory.CreateAsync(user.User);

            var claims = principal
                .Claims
                .Where(claim => context.RequestedClaimTypes.Contains(claim.Type))
                .ToList();

            context.IssuedClaims = AddClaims(claims, user);
        }

        private List<Claim> AddClaims(List<Claim> claims, UserWithRole userWithRole)
        {
            var user = userWithRole.User;
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
            claims.Add(new Claim(type: ClaimTypes.Role, value: userWithRole.Role.ToString()));

            return claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = await _userRepository.HasEntityAsync(FetchUserId(context.Subject));
        }
    }
}