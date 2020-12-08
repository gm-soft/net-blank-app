using System;
using System.Threading.Tasks;
using Domain.Emails.Models;
using Domain.Emails.Responses;
using Microsoft.Extensions.Logging;

namespace Domain.Emails.Clients
{
    public class LocalEmailSender : IEmailSender
    {
        private readonly ILogger<LocalEmailSender> _logger;

        public LocalEmailSender(ILogger<LocalEmailSender> logger)
        {
            _logger = logger;
        }

        public Task<IEmailResponse> SendSingleEmailAsync(IEmailContent email)
        {
            var breaker = Environment.NewLine;

            _logger.LogInformation(
                $"Email was sent{breaker}" +
                $"Subject: {email.Subject}{breaker}" +
                $"Recipients: {email.Recipients.Count}{breaker}" +
                $"Cc: {email.Cc.Count}{breaker}" +
                $"Bcc: {email.HiddenCc.Count}{breaker}");

            return Task.FromResult((IEmailResponse)new LocalEmailResponse());
        }
    }
}