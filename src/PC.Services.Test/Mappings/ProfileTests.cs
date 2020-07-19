using System.Collections.Generic;
using PC.Database.Models.Users;
using PC.Models.Users;
using TestUtils.Mappings;
using Xunit;

namespace PC.Services.Test.Mappings
{
    public class ProfileTests
    {
        public ProfileTests()
        {
            AutomapperSingleton.Initialize();
        }

        [Fact]
        public void UserMapperTest()
        {
            var user = new DbUser
            {
                Id = 1,
                Email = "example@example.com"
            };
            var result = AutomapperSingleton.Mapper.Map<ApplicationUser>(user);
            if (result != null)
            {
                Assert.NotNull(result);
            }

            Assert.IsType<ApplicationUser>(result);
        }
    }
}