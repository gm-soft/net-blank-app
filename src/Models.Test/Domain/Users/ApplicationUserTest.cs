using System.Linq;
using System.Threading.Tasks;
using Database.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;
using TestUtils.Database;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using Utils.Enums;
using Xunit;

namespace PC.Models.Test.Domain.Users
{
    public class ApplicationUserTest
    {
        public ApplicationUserTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Theory]
        [InlineData(Role.Employee, true)]
        [InlineData(Role.HRManager, true)]
        [InlineData(Role.TopManager, false)]
        [InlineData(Role.SystemAdministrator, false)]
        public void HasRole_Ok(Role roleToCheck, bool expected)
        {
            var target = new ApplicationUserFactory(Role.HRManager).Build();

            Assert.Equal(Role.HRManager, target.Role);
            Assert.Equal(expected, target.HasRole(roleToCheck));
        }

        [Fact]
        public async Task ChangeRoleIfNecessary_TheRoleWillNotDuplicate_OkAsync()
        {
            await using var context = new SqliteContext();
            var user = await new ApplicationUserFactory(Role.Employee).BuildAsync(context);

            user = await context.Users
                .IncludeRoles()
                .ByIdOrNullAsync(user.Id);

            Assert.NotNull(user);
            Assert.Single(user.Roles);
            Assert.Equal(Role.Employee, (Role)user.Roles.First());

            user.ChangeRoleIfNecessary(Role.SystemAdministrator);

            await context.SaveChangesAsync();

            user = await context.Users
                .IncludeRoles()
                .ByIdOrNullAsync(user.Id);

            Assert.Single(user.Roles);
            Assert.Equal(Role.SystemAdministrator, (Role)user.Roles.First());
            Assert.Equal(1, await context.UserRoles.CountAsync());
        }
    }
}