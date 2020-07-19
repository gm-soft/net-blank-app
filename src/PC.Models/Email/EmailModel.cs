using System.Collections.Generic;

namespace PC.Models.Email
{
    public class EmailModel
    {
        public string From { get; set; }

        public ICollection<string> Recipients { get; set; }

        public ICollection<string> CC { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public EmailModel()
        {
        }

        public EmailModel(string from, ICollection<string> recipients, string subject, string body, ICollection<string> cc = null)
        {
            From = from;
            Recipients = recipients;
            CC = cc;
            Subject = subject;
            Body = body;
        }
    }
}
