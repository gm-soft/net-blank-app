using Utils.Helpers;

namespace PC.Domain.Services.Email.Models.CallToActions
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