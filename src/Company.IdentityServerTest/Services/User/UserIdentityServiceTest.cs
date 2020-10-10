using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using PC.Database.Models.Users;
using PC.Domain.Services.Claims;
using PC.Domain.Services.User;
using Utils.Enums;
using Xunit;

namespace Company.IdentityServerTest.Services.User
{
    public class UserIdentityServiceTest
    {
        private const string UserExampleEmail = "j.smith@gmail.com";
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

            var emailDomainValidatorService = new EmailDomainValidatorService("gmail.com");

            var target = new UserIdentityServiceStub(stub, emailDomainValidatorService, hasAnyOtherUser);

            DbUser createdUser = await target.CreateUserAsync(ClaimsUser());

            Assert.Equal(UserExampleEmail, createdUser.Email);
            Assert.Equal(UserExampleEmail, createdUser.UserName);
            Assert.Equal(ExampleFirstName, createdUser.FirstName);
            Assert.Equal(ExampleLastName, createdUser.LastName);
            Assert.True(createdUser.EmailConfirmed);
        }

        private ClaimsUser ClaimsUser()
        {
            var principal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            {
                new Claim(ClaimTypes.Email, UserExampleEmail),
                new Claim(ClaimTypes.GivenName, ExampleFirstName),
                new Claim(ClaimTypes.Surname, ExampleLastName)
            }));
            return new ClaimsUser(principal);
        }

        public IdentityResult CreateFailed()
        {
            return IdentityResult.Failed(new List<IdentityError>
            {
                new IdentityError
                {
                    Code = "AwesomeCode",
                    Description = "AwesomeDescription"
                }
            }.ToArray());
        }

        // TODO: Vlad unit test for email confirmation
    }
}