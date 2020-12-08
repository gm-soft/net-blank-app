using System.Collections.Generic;

namespace Domain.Emails.Models
{
    public interface IEmailContent
    {
        ICollection<string> Recipients { get; }

        ICollection<string> Cc { get; }

        ICollection<string> HiddenCc { get; }

        string From { get; }

        string Subject { get; }

        string Body { get; }
    }
}