using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Emails.Models
{
    public class EmailContent : IEmailContent
    {
        // For asp features
        public EmailContent()
        {
        }

        public EmailContent(
            string @from,
            string subject,
            string body,
            ICollection<string> recipients,
            ICollection<string> cc = null,
            ICollection<string> hiddenCc = null)
        {
            From = @from;
            Subject = subject;
            Body = body;
            Recipients = recipients;
            Cc = cc ?? Array.Empty<string>();
            HiddenCc = hiddenCc ?? Array.Empty<string>();
        }

        public ICollection<string> Recipients { get; set; }

        public ICollection<string> Cc { get; set; }

        public ICollection<string> HiddenCc { get; set; }

        [Required]
        public string From { get; set; }

        [Required]
        public string Subject { get; set; }

        public string Body { get; set; }
    }
}