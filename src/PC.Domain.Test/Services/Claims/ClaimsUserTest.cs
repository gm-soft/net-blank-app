using System;
using System.Security.Claims;
using PC.Domain.Services.Claims;
using Utils.Authorization;
using Utils.Enums;
using Xunit;

namespace PC.Domain.Test.Services.Claims
{
    public class ClaimsUserTest
    {
        private ClaimsUser Target(bool throwExIfNotFound, params Claim[] claims)
        {
            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims));
            return new ClaimsUser(principal, throwExIfNotFound);
        }

        private Claim ClaimRole(Role role) => new Claim(ClaimTypes.Role, role.ToString());

        private Claim FirstNameClaim(string firstName = "firstName") => new Claim(ClaimTypes.GivenName, firstName);

        private Claim LastNameClaim(string lastName = "lastName") => new Claim(ClaimTypes.Surname, lastName);

        private Claim UserNameClaim(string userName = "userName") => new Claim(CustomClaimTypes.Username, userName);

        private Claim EmailClaim(string email = "email") => new Claim(ClaimTypes.Email, email);

        private Claim IdClaim(long id = 1) => new Claim(ClaimTypes.NameIdentifier, id.ToString());

        private Claim FunctionManagerClaim(long? functionManagerId)
            => new Claim(CustomClaimTypes.FunctionManagerId, functionManagerId.ToString());

        [Fact]
        public void FirstName_ExceptionIfNoClaim_NoClaims_Exception()
        {
            var target = Target(true);
            Assert.Throws<InvalidOperationException>(() => target.Id);
            Assert.Throws<InvalidOperationException>(() => target.FirstName);
            Assert.Throws<InvalidOperationException>(() => target.LastName);
            Assert.Throws<InvalidOperationException>(() => target.UserName);
            Assert.Throws<InvalidOperationException>(() => target.Email);
            Assert.Throws<InvalidOperationException>(() => target.FunctionManagerId);
        }

        [Fact]
        public void HasAuth_HasNecessaryData_True()
        {
            Assert.True(Target(false, IdClaim(), FirstNameClaim(), LastNameClaim(), UserNameClaim()).HasAuth);
        }

        [Fact]
        public void HasAuth_NoNecessaryData_False()
        {
            Assert.False(Target(false).HasAuth);
        }

        [Fact]
        public void Id_Ok()
        {
            Assert.Equal(1, Target(false, IdClaim(1)).Id);
        }

        [Fact]
        public void Id_NoClaim_Ok()
        {
            Assert.Equal(default(long), Target(false).Id);
        }

        [Fact]
        public void FirstName_Ok()
        {
            const string firstName = "ololo";
            Assert.Equal(firstName, Target(false, FirstNameClaim(firstName)).FirstName);
        }

        [Fact]
        public void FirstName_NoClaim_Null_Ok()
        {
            Assert.Null(Target(false).FirstName);
        }

        [Fact]
        public void LastName_Ok()
        {
            const string lastName = "ololo";
            Assert.Equal(lastName, Target(false, LastNameClaim(lastName)).LastName);
        }

        [Fact]
        public void LastName_NoClaim_Null_Ok()
        {
            Assert.Null(Target(false).LastName);
        }

        [Fact]
        public void UserName_Ok()
        {
            const string username = "ololo";
            Assert.Equal(username, Target(false, UserNameClaim(username)).UserName);
        }

        [Fact]
        public void UserName_NoClaim_Null_Ok()
        {
            Assert.Null(Target(false).UserName);
        }

        [Fact]
        public void Email_Ok()
        {
            const string email = "ololo";
            Assert.Equal(email, Target(false, EmailClaim(email)).Email);
        }

        [Fact]
        public void Email_NoClaim_Null_Ok()
        {
            Assert.Null(Target(false).Email);
        }

        [Fact]
        public void FunctionManagerId_Ok()
        {
            Assert.Equal(1, Target(false, FunctionManagerClaim(1)).FunctionManagerId);
        }

        [Fact]
        public void FunctionManagerId_NullableClaim_Null_Ok()
        {
            Assert.Null(Target(false, FunctionManagerClaim(null)).FunctionManagerId);
        }

        [Fact]
        public void FunctionManagerId_NoClaim_Null_Ok()
        {
            Assert.Null(Target(false).FunctionManagerId);
        }

        [Fact]
        public void Role_Ok()
        {
            const Role role = Role.SystemAdministrator;
            Assert.Equal(role, Target(false, ClaimRole(role)).Role);
        }

        [Fact]
        public void Role_NoClaim_Exception()
        {
            Assert.Throws<InvalidOperationException>(() => Target(false).Role);
        }
    }
}