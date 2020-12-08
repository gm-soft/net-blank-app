using System.Collections.Generic;
using System.Security.Claims;
using Domain.Services.Auth;
using Moq;
using PC.Models.Records.Users;
using PC.Models.Users;
using Utils.Authorization;
using Utils.Helpers;
using Utils.Interfaces;

namespace TestUtils.Auth
{
    public class UserClaimsProviderMock
    {
        private readonly Mock<IUserClaimsProvider> _mock;

        private readonly ICollection<Claim> _claims;

        public UserClaimsProviderMock(IdentityUser user)
        {
            user.ThrowIfNull(nameof(user));
            _mock = new Mock<IUserClaimsProvider>();

            _claims = CreateClaimsPrincipal(user);
            _claims.Add(EmailConfirmedClaim(user.EmailConfirmed));
        }

        public UserClaimsProviderMock(User user)
        {
            user.ThrowIfNull(nameof(user));
            _mock = new Mock<IUserClaimsProvider>();

            _claims = CreateClaimsPrincipal(user);
            _claims.Add(EmailConfirmedClaim(user.EmailConfirmed));
        }

        public IUserClaimsProvider GetObject()
        {
            _mock
                .Setup(x => x.WithinWebRequest())
                .Returns(true);

            _mock
                .Setup(x => x.GetUserClaims())
                .Returns(new ClaimsPrincipal(new ClaimsIdentity(_claims)));

            return _mock.Object;
        }

        private static List<Claim> CreateClaimsPrincipal(IHasUserData data)
        {
            return new List<Claim>
            {
                new Claim(ClaimTypes.Role, data.Role.ToString()),
                new Claim(ClaimTypes.NameIdentifier, data.Id.ToString()),
                new Claim(ClaimTypes.Email, data.Email),
                new Claim(ClaimTypes.GivenName, data.FirstName),
                new Claim(ClaimTypes.Surname, data.LastName),
                new Claim(CustomClaimTypes.Username, data.UserName)
            };
        }

        private static Claim EmailConfirmedClaim(bool value)
        {
            return new Claim(
                CustomClaimTypes.EmailConfirmed, value.ToString(), ClaimValueTypes.Boolean);
        }
    }
}