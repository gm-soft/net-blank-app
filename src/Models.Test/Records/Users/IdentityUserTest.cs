using System;
using System.Security.Claims;
using PC.Models.Records.Users;
using Utils.Authorization;
using Utils.Enums;
using Xunit;

namespace Models.Test.Records.Users
{
    public class IdentityUserTest
    {
        private IdentityUser Target(params Claim[] claims)
        {
            return new IdentityUser(new ClaimsPrincipal(new ClaimsIdentity(claims)));
        }

        private Claim RoleClaim(Role role) => new Claim(ClaimTypes.Role, role.ToString());

        private Claim FirstNameClaim(string firstName = "firstName") => new Claim(ClaimTypes.GivenName, firstName);

        private Claim LastNameClaim(string lastName = "lastName") => new Claim(ClaimTypes.Surname, lastName);

        private Claim UserNameClaim(string userName = "userName") => new Claim(CustomClaimTypes.Username, userName);

        private Claim EmailClaim(string email = "email") => new Claim(ClaimTypes.Email, email);

        private Claim IdClaim(long id = 1) => new Claim(ClaimTypes.NameIdentifier, id.ToString());

        private Claim EmailConfirmedClaim(bool emailConfirmed) =>
            new Claim(CustomClaimTypes.EmailConfirmed, emailConfirmed.ToString());

        [Fact]
        public void Ctor_NoClaims_Exception()
        {
            Assert.Throws<InvalidOperationException>(() => Target());
        }

        [Fact]
        public void Ctor_Ok()
        {
            IdentityUser target = Target(
                IdClaim(1488),
                FirstNameClaim("Hello"),
                LastNameClaim("World"),
                EmailClaim("h.world@example.com"),
                RoleClaim(Role.Employee),
                UserNameClaim("h.world@example.com"),
                EmailConfirmedClaim(true));

            Assert.Equal(1488, target.Id);
            Assert.Equal("Hello", target.FirstName);
            Assert.Equal("World", target.LastName);
            Assert.Equal("h.world@example.com", target.Email);
            Assert.Equal("h.world@example.com", target.UserName);
            Assert.Equal(Role.Employee, target.Role);
        }
    }
}