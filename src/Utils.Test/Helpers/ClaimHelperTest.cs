using System;
using System.Collections.Generic;
using System.Security.Claims;
using Utils.Enums;
using Utils.Helpers;
using Xunit;

namespace Utils.Test.Helpers
{
    public class ClaimHelperTest
    {
        [Theory]
        [InlineData(Role.System)]
        [InlineData(Role.SystemAdministrator)]
        [InlineData(Role.TopManager)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.Employee)]
        [InlineData(Role.None)]
        public void Role_Ok(Role roleToCheck)
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>
            {
                new Claim(ClaimTypes.Role, roleToCheck.ToString())
            });

            Assert.Equal(roleToCheck, principal.Role());
        }

        [Fact]
        public void GetClaimValue_ClaimsNotNull_TypeExists_Ok()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>
            {
                new Claim(ClaimTypes.Email, "john_smith@email.com"),
                new Claim(ClaimTypes.GivenName, "john"),
                new Claim(ClaimTypes.Surname, "smith")
            });

            Assert.Equal("john_smith@email.com", principal.GetClaimValue(ClaimTypes.Email));
            Assert.Equal("john", principal.GetClaimValue(ClaimTypes.GivenName));
            Assert.Equal("smith", principal.GetClaimValue(ClaimTypes.Surname));

            Assert.Equal("john_smith@email.com", principal.Claims.GetClaimValue(ClaimTypes.Email));
            Assert.Equal("john", principal.Claims.GetClaimValue(ClaimTypes.GivenName));
            Assert.Equal("smith", principal.Claims.GetClaimValue(ClaimTypes.Surname));
        }

        [Fact]
        public void GetClaimValue_ClaimsNotNull_TypeDoesNotExist_ThrowIfError_Exception()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>
            {
                new Claim(ClaimTypes.Email, "john_smith@email.com"),
                new Claim(ClaimTypes.GivenName, "john")
            });

            Assert.Throws<InvalidOperationException>(() => principal.GetClaimValue(ClaimTypes.Surname));
            Assert.Throws<InvalidOperationException>(() => principal.Claims.GetClaimValue(ClaimTypes.Surname));
        }

        [Fact]
        public void GetClaimValue_ClaimsNotNull_TypeDoesNotExist_NotThrowIfError_Ok()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>
            {
                new Claim(ClaimTypes.Email, "john_smith@email.com"),
                new Claim(ClaimTypes.GivenName, "john")
            });

            Assert.Null(principal.GetClaimValue(ClaimTypes.Surname, false));
            Assert.Null(principal.Claims.GetClaimValue(ClaimTypes.Surname, false));
        }

        [Fact]
        public void GetClaimValue_ClaimsAreEmpty_TypeDoesNotExist_NotThrowIfError_Ok()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>());

            Assert.Null(principal.GetClaimValue(ClaimTypes.Surname, false));
            Assert.Null(principal.Claims.GetClaimValue(ClaimTypes.Surname, false));
        }

        [Fact]
        public void GetClaimValue_ClaimsAreEmpty_TypeDoesNotExist_ThrowIfError_Exception()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>());
            Assert.Throws<InvalidOperationException>(() => principal.GetClaimValue(ClaimTypes.Surname));
            Assert.Throws<InvalidOperationException>(() => principal.Claims.GetClaimValue(ClaimTypes.Surname));
        }

        [Fact]
        public void GetClaimValue_ClaimsNull_Exception()
        {
            List<Claim> claims = null;
            Assert.Throws<ArgumentNullException>(() => claims.GetClaimValue(ClaimTypes.Surname));
        }

        [Fact]
        public void GetClaimValue_TypeNull_Exception()
        {
            ClaimsPrincipal principal = CreateTestInstance(new List<Claim>());
            Assert.Throws<ArgumentNullException>(() => principal.GetClaimValue(null));
            Assert.Throws<ArgumentNullException>(() => principal.Claims.GetClaimValue(null));
        }

        private ClaimsPrincipal CreateTestInstance(IEnumerable<Claim> claims)
        {
            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims));

            return principal;
        }
    }
}