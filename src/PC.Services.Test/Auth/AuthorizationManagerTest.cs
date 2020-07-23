using Moq;
using PC.Database.Repositories.Users;
using PC.Services.Auth;
using TestUtils.Auth;
using TestUtils.Mappings;
using Utils.Enums;
using Utils.Exceptions;
using Xunit;

namespace PC.Services.Test.Auth
{
    public class AuthorizationManagerTest
    {
        public AuthorizationManagerTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Theory]
        [InlineData(Role.HRManager, Role.Employee)]
        [InlineData(Role.TopManager, Role.Employee)]
        [InlineData(Role.SystemAdministrator, Role.Employee)]
        [InlineData(Role.System, Role.Employee)]
        public void HasCurrentUserRole_RoleAbovePassed_False(Role roleToCheck, Role currentUserRole)
        {
            var target = new AuthorizationManager(
                new UserClaimsProviderMock(currentUserRole).GetObject(),
                new Mock<IUserRepository>().Object);

            Assert.False(target.HasCurrentUserRole(roleToCheck));
        }

        [Theory]
        [InlineData(Role.Employee, Role.System)]
        [InlineData(Role.HRManager, Role.System)]
        [InlineData(Role.TopManager, Role.System)]
        [InlineData(Role.SystemAdministrator, Role.System)]
        [InlineData(Role.System, Role.System)]
        public void HasCurrentUserRole_RoleBelowPassed_True(Role roleToCheck, Role currentUserRole)
        {
            var target = new AuthorizationManager(
                new UserClaimsProviderMock(currentUserRole).GetObject(),
                new Mock<IUserRepository>().Object);

            Assert.True(target.HasCurrentUserRole(roleToCheck));
        }

        [Theory]
        [InlineData(Role.Employee, Role.System)]
        [InlineData(Role.HRManager, Role.System)]
        [InlineData(Role.TopManager, Role.System)]
        [InlineData(Role.SystemAdministrator, Role.System)]
        [InlineData(Role.System, Role.System)]
        public void HasCurrentUserRoleOrFail_AllowedRole_Ok(Role roleToCheck, Role currentUserRole)
        {
            var target = new AuthorizationManager(
                new UserClaimsProviderMock(currentUserRole).GetObject(),
                new Mock<IUserRepository>().Object);

            // No exception was thrown
            target.HasCurrentUserRoleOrFail(roleToCheck);
        }

        [Theory]
        [InlineData(Role.HRManager, Role.Employee)]
        [InlineData(Role.TopManager, Role.Employee)]
        [InlineData(Role.SystemAdministrator, Role.Employee)]
        [InlineData(Role.System, Role.Employee)]
        public void HasCurrentUserRoleOrFail_NotAllowedRole_Fail(Role roleToCheck, Role currentUserRole)
        {
            var target = new AuthorizationManager(
                new UserClaimsProviderMock(currentUserRole).GetObject(),
                new Mock<IUserRepository>().Object);

            Assert.Throws<NoPermissionsException>(() => target.HasCurrentUserRoleOrFail(roleToCheck));
        }
    }
}