using System.Threading.Tasks;
using PC.Database.Repositories.Tests.Utils;
using PC.Database.Repositories.Users;
using PC.Services.User;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using Utils.Enums;
using Xunit;

namespace PC.Services.Test.Users
{
    public class UserServiceForIdentityServerTest
    {
        public UserServiceForIdentityServerTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Fact]
        public async Task UserByEmailAsync_HasNoUser_ReturnsNull_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userREpo = new UserRepositoryForIdentity(context, AutomapperSingleton.Mapper);
                await new ApplicationUserFactory(Role.Employee, email: "john.smith@gmail.com")
                    .BuildAsync(context);

                var target = new UserServiceForIdentityServer(userREpo);

                Assert.Null(await target.UserByEmailOrNullAsync("No_email_like_this"));
            }
        }

        [Fact]
        public async Task UserByEmailAsync_HasUser_BeingReturned_OkAsync()
        {
            using (var context = InMemoryDatabaseHelper.GetDbContext())
            {
                var userREpo = new UserRepositoryForIdentity(context, AutomapperSingleton.Mapper);
                var addedUser = await new ApplicationUserFactory(Role.Employee, email: "john.smith@gmail.com")
                        .BuildAsync(context);

                var target = new UserServiceForIdentityServer(userREpo);

                var user = await target.UserByEmailOrNullAsync("john.smith@gmail.com");

                Assert.NotNull(user);
                Assert.Equal(addedUser.Id, user.Id);
                Assert.Equal(Role.Employee, user.Role);
            }
        }
    }
}