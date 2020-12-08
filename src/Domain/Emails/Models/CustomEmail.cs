using System.ComponentModel.DataAnnotations;
using Utils.Helpers;
using Utils.Interfaces;

namespace Domain.Emails.Models
{
    public class CustomEmail : EmailBase
    {
        public CustomEmail(
            EmailContent emailContent,
            IViewRenderer renderer,
            IBaseUrls url)
            : base(renderer, url)
        {
            emailContent.Subject.ThrowIfNull("subject", nameof(emailContent.Subject));
            Content = emailContent.Body;
            Subject = emailContent.Subject;
            From = emailContent.From;

            foreach (var recipient in emailContent.Recipients)
            {
                Recipients.Add(recipient);
            }

            foreach (var copy in emailContent.Cc)
            {
                Cc.Add(copy);
            }

            foreach (var hiddenCopy in emailContent.HiddenCc)
            {
                HiddenCc.Add(hiddenCopy);
            }
        }

        protected override string ViewPath => "/Content/EmailTemplates/CustomEmail.cshtml";

        [Required]
        protected override string From { get; }

        [Required]
        protected override string Subject { get; }

        public string Content { get; }

        public string EmailTitle => Subject;
    }
}
