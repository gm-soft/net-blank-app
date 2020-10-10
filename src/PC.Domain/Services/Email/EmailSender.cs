using System.Linq;
using System.Threading.Tasks;
using PC.Domain.Services.Email.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
using Utils.Helpers;

namespace PC.Domain.Services.Email
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(ISendGridClient client)
        {
            _client = client;
        }

        private readonly ISendGridClient _client;

        public async Task<Response> SendSingleEmailAsync(IEmailContent email)
        {
            email.ThrowIfNull(nameof(email));

            return await _client.SendEmailAsync(Message(email));
        }

        private SendGridMessage Message(IEmailContent email)
        {
            SendGridMessage msg = MailHelper.CreateSingleEmailToMultipleRecipients(
                @from: new EmailAddress(email.From),
                tos: email.Recipients.Select(x => new EmailAddress(x)).ToList(),
                subject: email.Subject,
                plainTextContent: string.Empty,
                htmlContent: email.Body);

            if (email.Cc.Any())
            {
                msg.AddCcs(email.Cc.Select(x => new EmailAddress(x)).ToList());
            }

            return msg;
        }
    }
}