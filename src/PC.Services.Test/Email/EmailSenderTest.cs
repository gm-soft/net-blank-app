using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Email;
using PC.Services.Email;
using Xunit;

namespace PC.Services.Test.Email
{
    public class EmailSenderTest
    {
        [Theory]
        [InlineData("", new[] { "a.oral@gmail.com" }, "subject", "Hello World")]
        [InlineData("asd@asd.com", new[] { "" }, "subject", "Hello World")]
        [InlineData("asd@asd.com", new[] { "bsd@bsd.com" }, null, "Hello World")]
        [InlineData("asd@asd.com", new[] { "bsd@bsd.com" }, "subject", null)]
        [InlineData("asd@asd", new[] { "bsd@bsd.com" }, "subject", "Hello World")]
        [InlineData("asd@asd.com", new[] { "bsd@bsd" }, "subject", "Hello World")]
        public async Task EmailParametersTestAsync(string from, ICollection<string> recipients, string subject, string body)
        {
            var email = new EmailModel(from, recipients, subject, body);
            var sender = EmailSender.CreateWithClient(new SendGridClientFake());
            await Assert.ThrowsAsync<ArgumentException>(() => sender.SendSingleEmailAsync(email));
        }
    }
}