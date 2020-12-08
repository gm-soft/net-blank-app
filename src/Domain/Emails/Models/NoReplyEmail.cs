using Domain.Emails.Models.CallToActions;
using Utils.Interfaces;

namespace Domain.Emails.Models
{
    public abstract class NoReplyEmail : EmailBase
    {
        protected override string From => "no-reply@example.com";

        protected NoReplyEmail(IViewRenderer renderer, IBaseUrls url)
            : this(renderer, url, null)
        {
        }

        protected NoReplyEmail(IViewRenderer renderer, IBaseUrls url, CallToActionButton callToAction)
            : base(renderer, url, callToAction)
        {
        }
    }
}
