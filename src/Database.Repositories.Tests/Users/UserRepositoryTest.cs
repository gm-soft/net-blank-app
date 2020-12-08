using System.Linq;
using System.Threading.Tasks;
using Database.Repositories.Extensions;
using Database.Repositories.Users;
using Microsoft.EntityFrameworkCore;
using PC.Models.Users;
using TestUtils.Database;
using TestUtils.EntityFactories;
using Utils.Enums;
using Xunit;

namespace Database.Repositories.Tests.Users
{
    public class UserRepositoryTest
    {
        [Fact]
        public async Task WithRoles_OkAsync()
        {
            await using var context = new SqliteContext();
            var user = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

            user = await context.Users
                .Include(x => x.Roles)
                .ThenInclude(x => x.Role)
                .ByIdOrNullAsync(user.Id);

            Assert.NotNull(user);
            Assert.Single(user.Roles);

            Assert.Equal(Role.Employee, (Role)user.Roles.First());
        }

        [Fact]
        public async Task UpdateAsync_ChangeRoles_TheRoleWillNotDuplicate_OkAsync()
        {
            await using var context = new SqliteContext();
            var user = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

            user = await context.Users
                .IncludeRoles()
                .ByIdOrNullAsync(user.Id);

            Assert.NotNull(user);
            Assert.Single(user.Roles);
            Assert.Equal(Role.Employee, (Role)user.Roles.First());

            var target = new UserRepository(context);

            user.ChangeRoleIfNecessary(Role.SystemAdministrator);
            await target.UpdateAsync(user);

            user = await context.Users
                .IncludeRoles()
                .ByIdOrNullAsync(user.Id);

            Assert.Single(user.Roles);
            Assert.Equal(Role.SystemAdministrator, (Role)user.Roles.First());
            Assert.Equal(1, await context.UserRoles.CountAsync());

            IdentityUserRole first = await context.UserRoles.SingleAsync();
            Assert.Equal(user.Id, first.UserId);
            Assert.Equal(Role.SystemAdministrator, (Role)first);
        }
    }
}