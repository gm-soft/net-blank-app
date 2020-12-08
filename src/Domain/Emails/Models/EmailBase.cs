using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Emails.Models.CallToActions;
using Utils.Helpers;
using Utils.Interfaces;

namespace Domain.Emails.Models
{
    public abstract class EmailBase : IEmail
    {
        public string BaseUrl => _url.BaseUrl;

        public string ImagesBaseUrl => _url.ImageBaseUrl;

        public CallToActionButton CallToAction { get; }

        protected ICollection<string> Recipients { get; }

        protected ICollection<string> Cc { get; private set; }

        protected ICollection<string> HiddenCc { get; private set; }

        protected abstract string Subject { get; }

        protected abstract string ViewPath { get; }

        protected abstract string From { get; }

        private readonly IViewRenderer _renderer;

        private readonly IBaseUrls _url;

        protected EmailBase(IViewRenderer renderer, IBaseUrls url)
            : this(renderer, url, null)
        {
        }

        protected EmailBase(IViewRenderer renderer, IBaseUrls url, CallToActionButton callToAction)
        {
            renderer.ThrowIfNull(nameof(renderer));
            url.ThrowIfNull(nameof(url));

            _renderer = renderer;
            _url = url;

            CallToAction = callToAction;

            Recipients = new List<string>();
            Cc = new List<string>();
            HiddenCc = new List<string>();
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

                Cc = Cc.Where(x => !Recipients.Contains(x)).ToArray();
            }

            if (HiddenCc.Any())
            {
                foreach (string cc in HiddenCc)
                {
                    if (!StringHelpers.IsValidEmail(cc))
                    {
                        throw new InvalidOperationException($"Email '{cc}' is invalid");
                    }
                }

                HiddenCc = HiddenCc
                    .Where(x => !Cc.Contains(x))
                    .Where(x => !Recipients.Contains(x)).ToArray();
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
                cc: Cc,
                hiddenCc: HiddenCc);
        }
    }
}