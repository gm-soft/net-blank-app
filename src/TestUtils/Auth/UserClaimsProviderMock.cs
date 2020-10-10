using System.Collections.Generic;
using System.Security.Claims;
using Moq;
using PC.Domain.Services.Auth;
using PC.Models.Users;
using Utils.Authorization;
using Utils.Enums;

namespace TestUtils.Auth
{
    public class UserClaimsProviderMock
    {
        private readonly Mock<IUserClaimsProvider> _mock;

        private readonly Role _currentUserClaimRole;

        private readonly ApplicationUser _user;

        public UserClaimsProviderMock(Role currentUserClaimRole)
        {
            _mock = new Mock<IUserClaimsProvider>();
            _currentUserClaimRole = currentUserClaimRole;
        }

        public UserClaimsProviderMock(ApplicationUser user)
        {
            _mock = new Mock<IUserClaimsProvider>();
            _currentUserClaimRole = user.Role;
            _user = user;
        }

        public IUserClaimsProvider GetObject()
        {
            _mock
                .Setup(x => x.WithinWebRequest())
                .Returns(true);

            _mock
                .Setup(x => x.GetUserClaims())
                .Returns(CreateClaimsPrincipal(_currentUserClaimRole));

            return _mock.Object;
        }

        private ClaimsPrincipal CreateClaimsPrincipal(Role role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, role.ToString())
            };

            if (_user != null)
            {
                claims.Add(new Claim(ClaimTypes.Email, _user.Email));
                claims.Add(new Claim(ClaimTypes.GivenName, _user.FirstName));
                claims.Add(new Claim(ClaimTypes.Surname, _user.LastName));
                claims.Add(new Claim(CustomClaimTypes.Username, _user.UserName));
            }

            return new ClaimsPrincipal(new ClaimsIdentity(claims));
        }
    }
}