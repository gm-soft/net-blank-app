using System.Threading;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace PC.Domain.Test.Services.Email
{
    /// <summary>
    /// This fake class is for test purposes only.
    /// </summary>
    public class SendGridClientFake : SendGridClient
    {
        public SendGridClientFake()
            : base("AwesomeString")
        {
        }

        // We use 'new' to hide an original SendEmailAsync because this method is not virtual.
        public new Task<Response> SendEmailAsync(
            SendGridMessage msg,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return null;
        }
    }
}
