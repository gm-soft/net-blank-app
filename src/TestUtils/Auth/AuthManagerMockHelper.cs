using Moq;
using PC.Models.Users;
using PC.Services.Auth;
using Utils.Enums;
using Utils.Exceptions;

namespace TestUtils.Auth
{
    public class AuthManagerMockHelper
    {
        public IAuthorizationManager Manager
        {
            get
            {
                if (_manager == null)
                {
                    _manager = GetManager();
                }

                return _manager;
            }
        }

        private readonly ApplicationUser _currentUser;

        private readonly Mock<IAuthorizationManager> _managerMock;

        private IAuthorizationManager _manager;

        public AuthManagerMockHelper(ApplicationUser currentUser)
        {
            _currentUser = currentUser;

            _managerMock = new Mock<IAuthorizationManager>();
        }

        public AuthManagerMockHelper(Role role, long userId = default(long))
            : this(new ApplicationUser
            {
                Id = userId,
                FirstName = "John",
                LastName = "Smith",
                Email = "j.smith@petrel.ai",
                Role = role
            })
        {
        }

        public IAuthorizationManager GetManager()
        {
            _managerMock
                .Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(_currentUser);

            _managerMock
                .Setup(x => x.HasCurrentUserRole(It.IsAny<Role>()))
                .Returns<Role>(passedRole => _currentUser.Role >= passedRole);

            _managerMock
                .Setup(x => x.HasCurrentUserRoleOrFail(It.IsAny<Role>(), It.IsAny<string>()))
                .Callback<Role, string>((passedRole, passedMessage) =>
                {
                    if (_currentUser.Role < passedRole)
                    {
                        throw new NoPermissionsException(passedMessage ?? "Not Allowed");
                    }
                });

            return _managerMock.Object;
        }
    }
}