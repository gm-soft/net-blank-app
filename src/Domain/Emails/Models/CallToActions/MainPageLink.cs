using Utils.Helpers;

namespace Domain.Emails.Models.CallToActions
{
    public class MainPageLink : ILink
    {
        public MainPageLink(string baseUrl)
        {
            baseUrl.ThrowIfNullOrEmpty(nameof(baseUrl));

            Value = baseUrl;
        }

        public string Value { get; }
    }
}