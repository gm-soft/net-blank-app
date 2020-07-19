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
        [Fact]
        public void Ctor_hasClaims_Ok()
        {
            ClaimsPrincipal claims = new ClaimsPrincipalFactory()
                .AddClaim(ClaimTypes.GivenName, "John")
                .AddClaim(ClaimTypes.Surname, "Smith")
                .AddClaim(ClaimTypes.Email, "j.sminth@gmail.com")
                .AddClaim(CustomClaimTypes.Username, "j.sminth@gmail.com")
                .AddClaim(ClaimTypes.Role, Role.Employee.ToString())
                .Build();

            Assert.NotNull(claims.Identity);

            var target = new ApplicationUser(claims);

            Assert.Equal("John", target.FirstName);
            Assert.Equal("Smith", target.LastName);
            Assert.Equal("j.sminth@gmail.com", target.Email);
            Assert.Equal("j.sminth@gmail.com", target.UserName);
            Assert.Equal(Role.Employee, target.Role);
        }

        [Fact]
        public void Ctor_NoClaims_Exception()
        {
            Assert.Throws<ArgumentNullException>(() => new ApplicationUser(null));
        }

        [Fact]
        public void Ctor_EmptyClaims_Exception()
        {
            var claims = new ClaimsPrincipalFactory().Build();

            Assert.Empty(claims.Claims);
            Assert.Throws<InvalidOperationException>(() => new ApplicationUser(claims));
        }

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