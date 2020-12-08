using System.Threading.Tasks;
using Domain.Services.Auth;
using Moq;
using PC.Models.Users;
using TestUtils.EntityFactories;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;

namespace TestUtils.Auth
{
    public class FakeAuth : IAuthorizationManager
    {
        /// <summary>
        /// Gets an instance for System Administrator.
        /// </summary>
        public static IAuthorizationManager SysAdmin => new FakeAuth(Role.SystemAdministrator);

        private readonly Mock<IAuthorizationManager> _managerMock;

        public FakeAuth(User currentUser)
        {
            currentUser.ThrowIfNull(nameof(currentUser));

            _managerMock = new Mock<IAuthorizationManager>();

            _managerMock
                .Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(currentUser);

            _managerMock
                .Setup(x => x.HasCurrentUserRole(It.IsAny<Role>()))
                .Returns<Role>(passedRole => currentUser.Role >= passedRole);

            _managerMock
                .Setup(x => x.HasCurrentUserRoleOrFail(It.IsAny<Role>(), It.IsAny<string>()))
                .Callback<Role, string>((passedRole, passedMessage) =>
                {
                    if (currentUser.Role < passedRole)
                    {
                        throw new NoPermissionsException(passedMessage ?? "Not Allowed");
                    }
                });
        }

        public FakeAuth(Role role)
            : this(new FakeUser(role).Please())
        {
        }

        public Task<User> GetCurrentUserAsync()
        {
            return _managerMock.Object.GetCurrentUserAsync();
        }

        public bool HasCurrentUserRole(Role role)
        {
            return _managerMock.Object.HasCurrentUserRole(role);
        }

        public void HasCurrentUserRoleOrFail(Role role, string message = null)
        {
            _managerMock.Object.HasCurrentUserRoleOrFail(role, message);
        }
    }
}