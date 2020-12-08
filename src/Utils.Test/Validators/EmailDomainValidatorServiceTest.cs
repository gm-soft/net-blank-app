using System;
using Utils.Exceptions;
using Utils.Validators;
using Xunit;

namespace Utils.Test.Validators
{
    public class EmailDomainValidatorServiceTest
    {
        [Theory]
        [InlineData("j.smith@gmail.com")]
        [InlineData("j.smith@gmailai.com")]
        public void Validate_Email_Domain_Wrong(string email)
        {
            var target = new EmailDomainValidatorService("example.com");

            Assert.ThrowsAny<BadAssException>(() => target.Validate(email));
        }

        [Fact]
        public void Validate_Email_CreateService_With_Empty_Domains()
        {
            Assert.ThrowsAny<ArgumentException>(() => new EmailDomainValidatorService(string.Empty));
        }

        [Fact]
        public void Validate_Email_OnEmpty_Email()
        {
            var target = new EmailDomainValidatorService("example.com");

            Assert.ThrowsAny<ArgumentNullException>(() => target.Validate(string.Empty));
        }
    }
}