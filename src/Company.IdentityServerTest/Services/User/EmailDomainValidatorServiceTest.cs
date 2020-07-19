using System;
using PC.Services.User;
using Utils.Exceptions;
using Xunit;

namespace Company.IdentityServerTest.Services.User
{
    public class EmailDomainValidatorServiceTest
    {
        [Theory]
        [InlineData("j.smith@mail.com")]
        [InlineData("j.smith@gmail.kz")]
        public void Validate_Email_Domain_Wrong(string email)
        {
            var target = new EmailDomainValidatorService("gmail.com");

            Assert.ThrowsAny<BadRequestException>(() => target.Validate(email));
        }

        [Fact]
        public void Validate_Email_CreateService_With_Empty_Domains()
        {
            Assert.ThrowsAny<ArgumentException>(() => new EmailDomainValidatorService(string.Empty));
        }

        [Fact]
        public void Validate_Email_OnEmpty_Email()
        {
            var target = new EmailDomainValidatorService("gmail.com");

            Assert.ThrowsAny<ArgumentNullException>(() => target.Validate(string.Empty));
        }
    }
}