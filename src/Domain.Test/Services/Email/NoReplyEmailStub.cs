using System.Collections.Generic;
using Domain.Emails;
using Domain.Emails.Models;
using TestUtils.ServiceStubs;

namespace Domain.Test.Services.Email
{
    public class NoReplyEmailStub : NoReplyEmail
    {
        public NoReplyEmailStub(
            IReadOnlyCollection<string> recipients,
            IReadOnlyCollection<string> cc,
            string subject,
            string viewPath,
            IViewRenderer renderer)
            : base(renderer, new BaseUrlsStub())
        {
            Subject = subject;
            ViewPath = viewPath;

            if (recipients != null)
            {
                foreach (string recipient in recipients)
                {
                    Recipients.Add(recipient);
                }
            }

            if (cc != null)
            {
                foreach (string recipient in cc)
                {
                    Cc.Add(recipient);
                }
            }
        }

        protected override string Subject { get; }

        protected override string ViewPath { get; }
    }
}