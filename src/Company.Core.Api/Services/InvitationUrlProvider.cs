using Microsoft.Extensions.Configuration;
using PC.Services.Email;

namespace Company.Core.Api.Services
{
    public class InvitationUrlProvider : IInvitationUrlProvider
    {
        private readonly string _url;

        public InvitationUrlProvider(IConfiguration config)
        {
            _url = config["baseUrl"];
        }

        public string GetInvitationUrl()
        {
            return _url + "/login";
        }
    }
}