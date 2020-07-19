using System;
using PC.Database.Models.Users;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using TestUtils.Mappings;
using Utils.Enums;
using Xunit;

namespace PC.Services.Test.Mappings.Users
{
    public class ApplicationUserProfileTest
    {
        public ApplicationUserProfileTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Fact]
        public void UserWithRole_Null_Ok()
        {
            Assert.Null(AutomapperSingleton.Mapper.Map<ApplicationUser>(null));
        }

        [Fact]
        public void UserWithRole_UserIsNull_Ok()
        {
            var source = new UserWithRole();
            Assert.Null(source.User);

            Assert.Throws<ArgumentNullException>(() => AutomapperSingleton.Mapper.Map<ApplicationUser>(source));
        }

        [Theory]
        [InlineData(Role.System)]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.Employee)]
        [InlineData(Role.None)]
        public void UserWithRole_InstanceWithRole_Ok(Role role)
        {
            const string firstName = "John";
            const string lastName = "Smith";
            const string email = "j.smith@gmail.com";

            var source = new UserWithRole
            {
                User = new DbUser
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    UserName = email,
                },
                Role = role
            };

            var destination = AutomapperSingleton.Mapper.Map<ApplicationUser>(source);

            Assert.NotNull(destination);

            Assert.Equal(role, destination.Role);
            Assert.Equal(firstName, destination.FirstName);
            Assert.Equal(lastName, destination.LastName);
            Assert.Equal(email, destination.Email);
            Assert.Equal(email, destination.UserName);
        }
    }
}