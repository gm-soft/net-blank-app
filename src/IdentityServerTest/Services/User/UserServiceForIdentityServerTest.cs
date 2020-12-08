using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using IdentityServerTest.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Utils.Enums;
using Xunit;

namespace IdentityServerTest.Services.User
{
    public class UserServiceForIdentityServerTest
    {
        [Fact]
        public async Task UserByEmailAsync_HasNoUser_ReturnsNull_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var user = await new UserFactory(
                        Role.Employee,
                        "john.smith@example.com")
                    .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                Assert.Null(await target.UserByUserNameOrNullAsync("No_email_like_this"));
            }
        }

        [Fact]
        public async Task UserByEmailAsync_HasUser_BeingReturned_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }

        [Fact]
        public async Task DeleteAsync_HasUser_BeingRemoved_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
                Assert.True(user.Active());

                await target.DeleteAsync(user.UserName);

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.False(user.Active());
            }
        }

        [Fact]
        public async Task DeleteAsync_UserDoesNotExist_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);

                await target.DeleteAsync("not.exist@example.com");

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }

        [Fact]
        public async Task RemoveAsync_HasUser_BeingRemoved_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .Outdated()
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.False(user.Active());

                await target.RemoveAsync(addedUser.UserName);

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.Null(user);

                Assert.False(await context.Users.AnyAsync());
                Assert.False(await context.UserRoles.AnyAsync());
            }
        }

        [Fact]
        public async Task RemoveAsync_UserDoesNotExist_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);

                await target.RemoveAsync("not.exist@example.com");

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }

        [Fact]
        public async Task RemoveAsync_UserIsActive_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);

                await target.RemoveAsync(user.UserName);

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }

        [Fact]
        public async Task UpdateAsync_UserDoesNotExist_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);

                var newUser = new IdentityServer.Database.Models.User
                {
                    FirstName = Faker.Name.First(),
                    LastName = Faker.Name.Last(),
                    UserName = "fake.user@example.com"
                };

                await target.UpdateAsync(newUser);

                user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }

        [Fact]
        public async Task UpdateAsync_HasUser_FirstNameAndLastNameWasChanged_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                user.FirstName = "Neo1";
                user.LastName = "Tom1";

                await target.UpdateAsync(user);

                var userInDb = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                // was changed
                Assert.Equal("Neo1", userInDb.FirstName);
                Assert.Equal("Tom1", userInDb.LastName);

                // Was not changed
                Assert.Equal("john.smith@example.com", userInDb.Email);
                Assert.Equal("john.smith@example.com", userInDb.UserName);

                Assert.Equal(Role.Employee, userInDb.Role);
            }
        }

        [Fact]
        public async Task UpdateAsync_HasUser_RoleWasChanged_OkAsync()
        {
            using (var context = new IdentitySqliteContext())
            {
                var addedUser = await new UserFactory(Role.Employee, email: "john.smith@example.com")
                        .PleaseAsync(context);

                var target = new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object);

                var user = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                user.Role = Role.HRManager;

                await target.UpdateAsync(user);

                var userInDb = await target.UserByUserNameOrNullAsync(addedUser.UserName);

                // was changed
                Assert.Equal(Role.HRManager, userInDb.Role);

                // Was not changed
                Assert.Equal("john.smith@example.com", userInDb.Email);
                Assert.Equal("john.smith@example.com", userInDb.UserName);
            }
        }
    }
}