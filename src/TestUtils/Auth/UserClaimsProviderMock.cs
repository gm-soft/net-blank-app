using System.Collections.Generic;
using System.Security.Claims;
using Moq;
using PC.Services.Auth;
using Utils.Enums;

namespace TestUtils.Auth
{
    public class UserClaimsProviderMock
    {
        private readonly Mock<IUserClaimsProvider> _mock;

        private readonly Role _currentUserClaimRole;

        public UserClaimsProviderMock(Role currentUserClaimRole)
        {
            _mock = new Mock<IUserClaimsProvider>();
            _currentUserClaimRole = currentUserClaimRole;
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
            return new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            {
                new Claim(ClaimTypes.Role, role.ToString())
            }));
        }
    }
}