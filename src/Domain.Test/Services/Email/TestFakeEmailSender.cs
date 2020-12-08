using System.Threading.Tasks;
using Domain.Emails;
using Domain.Emails.Models;
using Domain.Emails.Responses;

namespace Domain.Test.Services.Email
{
    /// <summary>
    /// This fake class is for test purposes only.
    /// </summary>
    public class TestFakeEmailSender : IEmailSender
    {
        public TestFakeEmailSender()
        {
        }

        public Task<IEmailResponse> SendSingleEmailAsync(IEmailContent email)
        {
            return Task.FromResult((IEmailResponse)new LocalEmailResponse());
        }
    }
}
