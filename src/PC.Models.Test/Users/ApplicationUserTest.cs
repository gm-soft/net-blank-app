using System;
using System.Security.Claims;
using PC.Models.Users;
using TestUtils.EntityFactories;
using TestUtils.Identity;
using Utils.Authorization;
using Utils.Enums;
using Xunit;

namespace PC.Models.Test.Users
{
    public class ApplicationUserTest
    {
        [Theory]
        [InlineData(Role.Employee, true)]
        [InlineData(Role.HRManager, true)]
        [InlineData(Role.TopManager, false)]
        [InlineData(Role.SystemAdministrator, false)]
        public void HasRole_Ok(Role roleToCheck, bool expected)
        {
            ApplicationUser target = new ApplicationUserFactory(Role.HRManager).Build();

            Assert.Equal(Role.HRManager, target.Role);
            Assert.Equal(expected, target.HasRole(roleToCheck));
        }
    }
}