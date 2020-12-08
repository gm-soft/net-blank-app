using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Emails;
using Domain.Emails.Models;
using Domain.Emails.Responses;
using Moq;
using PC.Domain.Test.Services.Email;
using PC.Models.Users;
using TestUtils.Auth;
using TestUtils.Database;
using TestUtils.EntityFactories;
using TestUtils.Mappings;
using TestUtils.ServiceStubs;
using Utils.Enums;
using Utils.Exceptions;
using Xunit;

namespace Domain.Test.Services.Email
{
    public class EmailServiceTest
    {
        public EmailServiceTest()
        {
            AutomapperSingleton.Initialize();
        }

        [Theory]
        [InlineData(Role.TopManager)]
        [InlineData(Role.System)]
        [InlineData(Role.SystemAdministrator)]
        public async Task SendCustomEmail_OkAsync(Role role)
        {
            using (var dbContext = InMemoryDatabaseHelper.GetDbContext())
            {
                var user = await new ApplicationUserFactory(role).BuildAsync(dbContext);
                var emailContent = new EmailContent(
                    @from: "intranet@example.com",
                    subject: "test",
                    body: "<p> Hello world </P>",
                    recipients: new List<string>() { "john@example.com" });
                var emailSender = new Mock<IEmailSender>();
                emailSender
                    .Setup(x => x.SendSingleEmailAsync(It.IsAny<IEmailContent>()))
                    .ReturnsAsync((IEmailContent x) =>
                    {
                        Assert.Single(x.Recipients);
                        Assert.Empty(x.Cc);
                        Assert.Equal(emailContent.Subject, x.Subject);
                        Assert.Equal(emailContent.From, x.From);
                        Assert.True(x.Recipients.Contains("john@example.com"));

                        return It.IsAny<IEmailResponse>();
                    });

                var service = Target(user, emailSender);
                await service.SendCustomEmailAsync(emailContent);
            }
        }

        [Theory]
        [InlineData(Role.Employee)]
        [InlineData(Role.HRManager)]
        [InlineData(Role.Partner)]
        public async Task SendCustomEmail_NotAllowedRoles_ExceptionAsync(Role role)
        {
            using (var dbContext = InMemoryDatabaseHelper.GetDbContext())
            {
                var user = await new ApplicationUserFactory(role).BuildAsync(dbContext);
                var emailContent = new EmailContent(
                    @from: "intranet@example.com",
                    subject: "test",
                    body: "<p> Hello world </P>",
                    recipients: new List<string>() { "john@example.com" });

                var service = Target(user);
                await Assert.ThrowsAsync<NoPermissionsException>(() => service.SendCustomEmailAsync(emailContent));
            }
        }

        private EmailService Target(User currentUser, Mock<IEmailSender> emailSender = null)
        {
            var authMock = new FakeAuth(currentUser);

            return new EmailService(
                emailSender: emailSender?.Object ?? new TestFakeEmailSender(),
                authManager: authMock,
                viewRenderer: new ViewRendererFake(),
                url: new BaseUrlsStub());
        }
    }
}