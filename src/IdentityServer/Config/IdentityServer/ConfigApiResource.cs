using IdentityServer4.Models;
using Utils.Helpers;

namespace IdentityServer.Config.IdentityServer
{
    public class ConfigApiResource
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool Valid()
        {
            return !Name.NullOrEmpty() &&
                   !DisplayName.NullOrEmpty();
        }

        public ApiResource ApiResource()
        {
            return new ApiResource(Name, DisplayName);
        }
    }
}