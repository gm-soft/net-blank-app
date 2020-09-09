using System.Collections.Generic;

namespace PC.Services.Email.Models
{
    public interface IEmailContent
    {
        ICollection<string> Recipients { get; }

        ICollection<string> Cc { get; }

        string From { get; }

        string Subject { get; }

        string Body { get; }
    }
}