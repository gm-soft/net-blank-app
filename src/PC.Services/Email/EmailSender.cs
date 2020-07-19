using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using PC.Models.Email;
using SendGrid;
using SendGrid.Helpers.Mail;
using Utils.Helpers;

namespace PC.Services.Email
{
    public class EmailSender : IEmailSender
    {
        /// <summary>
        /// Method for initialization with created <see cref="SendGridClient"/>.
        /// We use static method to avoid possible DI injection errors.
        /// </summary>
        /// <param name="client">SendGridClient.</param>
        /// <returns>EmailSender instance.</returns>
        public static EmailSender CreateWithClient(SendGridClient client)
        {
            return new EmailSender(client);
        }

        private EmailSender(SendGridClient client)
        {
            _client = client;
        }

        private readonly SendGridClient _client;

        public EmailSender(IConfiguration configuration)
        {
            _client = new SendGridClient(configuration["SendGridApiKey"]);
        }

        public async Task<Response> SendSingleEmailAsync(EmailModel model)
        {
            ValidateParameters(model);

            var msg = MailHelper.CreateSingleEmailToMultipleRecipients(
                @from: new EmailAddress(model.From),
                tos: model.Recipients.Select(x => new EmailAddress(x)).ToList(),
                subject: model.Subject,
                plainTextContent: string.Empty,
                htmlContent: model.Body);

            if (model.CC != null && model.CC.Count > 0)
            {
                msg.AddCcs(model.CC.Select(x => new EmailAddress(x)).ToList());
            }

            return await _client.SendEmailAsync(msg);
        }

        public async Task<Response> SendSingleEmailAsync(
            string body,
            string subject,
            List<string> recipients,
            List<string> cc = null)
        {
            var emailModel = new EmailModel
            {
                Body = body,
                From = "no-reply@gmail.com",
                Recipients = recipients,
                CC = cc,
                Subject = subject
            };

            return await SendSingleEmailAsync(emailModel);
        }

        private void ValidateParameters(EmailModel model)
        {
            if (string.IsNullOrEmpty(model.Subject))
            {
                throw new ArgumentException("Field can not be null or empty", nameof(model.Subject));
            }

            if (string.IsNullOrEmpty(model.Body))
            {
                throw new ArgumentException("Field can not be null or empty", nameof(model.Body));
            }

            if (!StringHelpers.IsValidEmail(model.From))
            {
                throw new ArgumentException("Invalid email", nameof(model.From));
            }

            if (model.Recipients.Any(rec => !StringHelpers.IsValidEmail(rec)))
            {
                throw new ArgumentException("Invalid email", nameof(model.Recipients));
            }
        }
    }
}