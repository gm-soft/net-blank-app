using System.Threading.Tasks;
using Database.Repositories.Users;
using Domain.Exceptions;
using Domain.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Moq;
using PC.Models.Records.Users;
using TestUtils.Auth;
using TestUtils.Database;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using Utils.Enums;
using Utils.Exceptions;
using Xunit;

namespace Domain.Test.Services.Auth
{
    public class AuthorizationTest
    {
        public AuthorizationTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Theory]
        [InlineData(Role.Partner)]
        [InlineData(Role.Employee)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.SystemAdministrator)]
        public async Task GetCurrentUserAsync_NoUserWithUsername_CreatesNewOne_Async(Role role)
        {
            await using var context = new SqliteContext();
            var identity = new IdentityUser(
                id: 1488,
                firstName: "Ololosha",
                lastName: "Petrov",
                email: "o.petrov@example.com",
                role: role,
                emailConfirmed: false);

            var target = new Authorization(
                new UserClaimsProviderMock(identity).GetObject(),
                new UserRepository(context));

            Assert.False(await context.Users.AnyAsync());
            Assert.False(await context.UserRoles.AnyAsync());

            var user = await target.GetCurrentUserAsync();

            Assert.Equal(1, await context.Users.CountAsync());

            Assert.NotEqual(user.Id, user.IdentityId);
            Assert.Equal(1488, user.IdentityId);
            Assert.Equal("Ololosha", user.FirstName);
            Assert.Equal("Petrov", user.LastName);
            Assert.Equal("o.petrov@example.com", user.UserName);
            Assert.Equal("o.petrov@example.com", user.Email);
            Assert.Equal(role, user.Role);
            Assert.False(user.EmailConfirmed);

            var roleAsLong = (long)role;
            Assert.True(
                await context.UserRoles.AnyAsync(x => x.UserId == user.Id && x.RoleId == roleAsLong));
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task GetCurrentUserAsync_UserWasCreatedInTheApi_IdentityIdIsNotNull_Async(bool confirmed)
        {
            await using var context = new SqliteContext();
            var identity = new IdentityUser(
                id: 1488,
                firstName: "Ololosha",
                lastName: "Petrov",
                email: "o.petrov@example.com",
                role: Role.Employee,
                emailConfirmed: confirmed);

            var createdUser = await new ApplicationUserFactory(
                new FakeUser(
                    role: Role.Employee,
                    userName: "o.petrov@example.com",
                    firstName: "Ololosha",
                    lastName: "Petrov"))
                .BuildAsync(context);

            Assert.False(createdUser.EmailConfirmed);
            Assert.Equal(1, createdUser.Id);
            Assert.Null(createdUser.IdentityId);
            Assert.Equal(identity.UserName, createdUser.UserName);
            Assert.Equal(identity.Email, createdUser.Email);

            Assert.Equal(1, await context.Users.CountAsync());

            var target = new Authorization(
                new UserClaimsProviderMock(identity).GetObject(),
                new UserRepository(context));

            var user = await target.GetCurrentUserAsync();

            Assert.Equal(1, await context.Users.CountAsync());

            Assert.Equal(1, user.Id);
            Assert.Equal(1488, user.IdentityId);
            Assert.Equal("Ololosha", user.FirstName);
            Assert.Equal("Petrov", user.LastName);
            Assert.Equal("o.petrov@example.com", user.UserName);
            Assert.Equal("o.petrov@example.com", user.Email);
            Assert.Equal(Role.Employee, user.Role);
            Assert.Equal(confirmed, user.EmailConfirmed);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task GetCurrentUserAsync_UserWasCreatedInTheApi_DifferentIdentityIds_ExceptionAsync(bool confirmed)
        {
            await using var context = new SqliteContext();
            var identity = new IdentityUser(
                id: 1488,
                firstName: "Ololosha",
                lastName: "Petrov",
                email: "o.petrov@example.com",
                role: Role.Employee,
                emailConfirmed: confirmed);

            var createdUser = await new ApplicationUserFactory(
                    new FakeUser(
                        role: Role.Employee,
                        userName: "o.petrov@example.com",
                        firstName: "Ololosha",
                        lastName: "Petrov"))
                .IdentityId(1)
                .BuildAsync(context);

            Assert.False(createdUser.EmailConfirmed);
            Assert.Equal(1, createdUser.Id);
            Assert.Equal(1, createdUser.IdentityId);
            Assert.Equal(identity.UserName, createdUser.UserName);
            Assert.Equal(identity.Email, createdUser.Email);

            Assert.Equal(1, await context.Users.CountAsync());

            var target = new Authorization(
                new UserClaimsProviderMock(identity).GetObject(),
                new UserRepository(context));

            var exception = await Assert.ThrowsAsync<BadAssException>(() =>
                target.GetCurrentUserAsync());

            Assert.NotNull(exception.InnerException);
            Assert.Equal(typeof(MismatchedIdentitiesException), exception.InnerException.GetType());
        }

        [Fact]
        public async Task GetCurrentUserAsync_NoUserWithUsername_EmailConfirmed_Async()
        {
            await using var context = new SqliteContext();
            var identity = new IdentityUser(
                id: 1488,
                firstName: "Ololosha",
                lastName: "Petrov",
                email: "o.petrov@example.com",
                role: Role.Employee,
                emailConfirmed: true);

            var target = new Authorization(
                new UserClaimsProviderMock(identity).GetObject(),
                new UserRepository(context));

            Assert.False(await context.Users.AnyAsync());
            Assert.False(await context.UserRoles.AnyAsync());

            var user = await target.GetCurrentUserAsync();

            Assert.Equal(1, await context.Users.CountAsync());

            Assert.NotEqual(user.Id, user.IdentityId);
            Assert.Equal(1488, user.IdentityId);
            Assert.Equal("Ololosha", user.FirstName);
            Assert.Equal("Petrov", user.LastName);
            Assert.Equal("o.petrov@example.com", user.UserName);
            Assert.Equal("o.petrov@example.com", user.Email);
            Assert.Equal(Role.Employee, user.Role);
            Assert.True(user.EmailConfirmed);

            const long roleAsLong = (long)Role.Employee;
            Assert.True(
                await context.UserRoles.AnyAsync(x => x.UserId == user.Id && x.RoleId == roleAsLong));
        }

        [Fact]
        public async Task GetCurrentUserAsync_CurrentUserWasCreated_CreatesNewOneViaUserService_OkAsync()
        {
            using (var context = new SqliteContext())
            {
                var identity = new IdentityUser(
                    id: 1,
                    firstName: "Ololosha",
                    lastName: "Petrov",
                    email: "o.petrov@example.com",
                    role: Role.SystemAdministrator,
                    emailConfirmed: false);

                var target = new Authorization(
                    new UserClaimsProviderMock(identity).GetObject(),
                    new UserRepository(context));

                Assert.False(await context.Users.AnyAsync());
                Assert.False(await context.UserRoles.AnyAsync());

                var user = await target.GetCurrentUserAsync();

                Assert.Equal(1, await context.Users.CountAsync());

                Assert.Equal(1, user.Id);
                Assert.Equal(1, user.IdentityId);
                Assert.Equal(Role.SystemAdministrator, user.Role);

                var newUser = await new ApplicationUserFactory(Role.Employee).CreateConfirmedAsync(context);
                Assert.Equal(2, newUser.Id);
                Assert.Null(newUser.IdentityId);
            }
        }

        [Fact]
        public async Task GetCurrentUserAsync_InactiveUser_IsBeingReturned_OkAsync()
        {
            using (var context = new SqliteContext())
            {
                var userRepo = new UserRepository(context);
                var user = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

                Assert.Null(user.DeletedAt);
                Assert.True(user.Active());

                await userRepo.DeleteAsync(user.Id);

                await Assert.ThrowsAsync<ResourceNotFoundException>(() => userRepo.GetByIdOrFailAsync(user.Id));

                var target = new Authorization(
                    new UserClaimsProviderMock(user).GetObject(),
                    userRepo);

                user = await target.GetCurrentUserAsync();

                Assert.NotNull(user);
                Assert.NotNull(user.DeletedAt);
                Assert.False(user.Active());
            }
        }

        [Fact]
        public async Task GetCurrentUserAsync_ActiveUser_IsBeingReturned_OkAsync()
        {
            using (var context = new SqliteContext())
            {
                var userRepo = new UserRepository(context);
                var user = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

                Assert.Null(user.DeletedAt);
                Assert.True(user.Active());

                var target = new Authorization(
                    new UserClaimsProviderMock(user).GetObject(),
                    userRepo);

                var currentUser = await target.GetCurrentUserAsync();

                Assert.NotNull(currentUser);
                Assert.Null(currentUser.DeletedAt);
                Assert.True(currentUser.Active());

                Assert.Equal(user.Id, currentUser.Id);
                Assert.Equal(user.UserName, currentUser.UserName);
            }
        }

        [Theory]
        [InlineData(Role.HRManager, Role.Employee)]
        [InlineData(Role.TopManager, Role.Employee)]
        [InlineData(Role.SystemAdministrator, Role.Employee)]
        [InlineData(Role.System, Role.Employee)]
        public void HasCurrentUserRole_RoleAbovePassed_False(Role roleToCheck, Role currentUserRole)
        {
            var target = new Authorization(
                new UserClaimsProviderMock(
                    new ApplicationUserFactory(currentUserRole).Build()).GetObject(),
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
            var target = new Authorization(
                new UserClaimsProviderMock(
                    new ApplicationUserFactory(currentUserRole).Build()).GetObject(),
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
            var target = new Authorization(
                new UserClaimsProviderMock(
                    new ApplicationUserFactory(currentUserRole).Build()).GetObject(),
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
            var target = new Authorization(
                new UserClaimsProviderMock(
                    new ApplicationUserFactory(currentUserRole).Build()).GetObject(),
                new Mock<IUserRepository>().Object);

            Assert.Throws<NoPermissionsException>(() => target.HasCurrentUserRoleOrFail(roleToCheck));
        }
    }
}