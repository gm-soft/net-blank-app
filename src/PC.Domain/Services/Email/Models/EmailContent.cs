using System.Collections.Generic;

namespace PC.Domain.Services.Email.Models
{
    public class EmailContent : IEmailContent
    {
        public EmailContent(
            string @from, string subject, string body, ICollection<string> recipients, ICollection<string> cc)
        {
            From = @from;
            Subject = subject;
            Body = body;
            Recipients = recipients;
            Cc = cc;
        }

        public ICollection<string> Recipients { get; }

        public ICollection<string> Cc { get; }

        public string From { get; }

        public string Subject { get; }

        public string Body { get; }
    }
}