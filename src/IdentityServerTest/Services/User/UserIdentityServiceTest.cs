using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.Claims;
using IdentityServerTest.Utils;
using Microsoft.AspNetCore.Identity;
using Utils.Enums;
using Utils.Validators;
using Xunit;

namespace IdentityServerTest.Services.User
{
    public class UserIdentityServiceTest
    {
        private const string UserExampleEmail = "j.smith@example.com";
        private const string ExampleFirstName = "John";
        private const string ExampleLastName = "Smith";

        [Theory]
        [InlineData(false, Role.SystemAdministrator)]
        [InlineData(true, Role.Employee)]
        public async Task CreateUserAsync_NoOtherUsers_RoleDependsOnOtherUsers_OkAsync(
            bool hasAnyOtherUser, Role roleOfCreatedUser)
        {
            var stub = new UserManagerStub(
                IdentityResult.Success,
                IdentityResult.Success,
                (user, role) => { Assert.Equal(roleOfCreatedUser.ToString(), role); },
                IdentityResult.Success);

            var emailDomainValidatorService = new EmailDomainValidatorService("example.com");

            var target = new UserIdentityServiceStub(stub, emailDomainValidatorService, hasAnyOtherUser);

            IdentityServer.Database.Models.User createdUser = await target.CreateUserAsync(ClaimsUser());

            Assert.Equal(UserExampleEmail, createdUser.Email);
            Assert.Equal(UserExampleEmail, createdUser.UserName);
            Assert.Equal(ExampleFirstName, createdUser.FirstName);
            Assert.Equal(ExampleLastName, createdUser.LastName);
            Assert.True(createdUser.EmailConfirmed);
        }

        private GoogleClaims ClaimsUser()
        {
            var principal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, DateTimeOffset.Now.Ticks.ToString()),
                new Claim(ClaimTypes.Email, UserExampleEmail),
                new Claim(ClaimTypes.GivenName, ExampleFirstName),
                new Claim(ClaimTypes.Surname, ExampleLastName)
            }));
            return new GoogleClaims(principal);
        }

        // TODO: Vlad unit test for email confirmation
    }
}