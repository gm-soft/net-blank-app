using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PC.Domain.Services.Email.Models.CallToActions;
using Utils.Helpers;
using Utils.Interfaces;

namespace PC.Domain.Services.Email.Models
{
    public abstract class NoReplyEmail : IEmail
    {
        public const string From = "no-reply@example.com";

        public string BaseUrl => _url.BaseUrl;

        public string ImagesBaseUrl => _url.ImageBaseUrl;

        public CallToActionButton CallToAction { get; }

        protected ICollection<string> Recipients { get; }

        protected ICollection<string> Cc { get; }

        protected abstract string Subject { get; }

        protected abstract string ViewPath { get; }

        private readonly IViewRenderer _renderer;

        private readonly IBaseUrls _url;

        protected NoReplyEmail(IViewRenderer renderer, IBaseUrls url)
            : this(renderer, url, null)
        {
        }

        protected NoReplyEmail(IViewRenderer renderer, IBaseUrls url, CallToActionButton callToAction)
        {
            renderer.ThrowIfNull(nameof(renderer));
            url.ThrowIfNull(nameof(url));

            _renderer = renderer;
            _url = url;

            CallToAction = callToAction;

            Recipients = new List<string>();
            Cc = new List<string>();
        }

        public void ThrowIfInvalid()
        {
            Recipients.ThrowIfNullOrEmpty(nameof(Recipients));
            Subject.ThrowIfNullOrEmpty(nameof(Subject));
            ViewPath.ThrowIfNullOrEmpty(nameof(ViewPath));

            foreach (string recipient in Recipients)
            {
                if (!StringHelpers.IsValidEmail(recipient))
                {
                    throw new InvalidOperationException($"Email '{recipient}' is invalid");
                }
            }

            if (Cc.Any())
            {
                foreach (string cc in Cc)
                {
                    if (!StringHelpers.IsValidEmail(cc))
                    {
                        throw new InvalidOperationException($"Email '{cc}' is invalid");
                    }
                }
            }
        }

        public async Task<IEmailContent> RenderAsync()
        {
            ThrowIfInvalid();

            var body = await _renderer.RenderAsync(ViewPath, this);

            return new EmailContent(
                @from: From,
                subject: Subject,
                body: body,
                recipients: Recipients,
                cc: Cc);
        }
    }
}
