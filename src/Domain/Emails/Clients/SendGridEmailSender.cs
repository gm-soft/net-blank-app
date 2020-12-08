using System.Linq;
using System.Threading.Tasks;
using Domain.Emails.Models;
using Domain.Emails.Responses;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using Utils.Helpers;
using Utils.ValueObjects;

namespace Domain.Emails.Clients
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly SendGridClient _client;

        public SendGridEmailSender(IConfiguration configuration)
        {
            _client = new SendGridClient((string)new NonNullableString(configuration["SendGridApiKey"]));
        }

        public async Task<IEmailResponse> SendSingleEmailAsync(IEmailContent email)
        {
            email.ThrowIfNull(nameof(email));

            return new SendGridResponse(await _client.SendEmailAsync(Message(email)));
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

            if (email.HiddenCc.Any())
            {
                msg.AddBccs(email.HiddenCc.Select(x => new EmailAddress(x)).ToList());
            }

            return msg;
        }
    }
}