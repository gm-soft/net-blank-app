using IdentityServer4.Models;
using Utils.Helpers;

namespace Company.IdentityServer.Config.Models
{
    public class ConfigApiResource
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string Scope { get; set; }

        public bool Valid()
        {
            return !Name.NullOrEmpty() &&
                   !DisplayName.NullOrEmpty() &&
                   !Scope.NullOrEmpty();
        }

        public ApiScope ApiScope()
        {
            return new ApiScope(Name, DisplayName);
        }

        public ApiResource ApiResource()
        {
            return new ApiResource(Name, DisplayName)
            {
                Scopes =
                {
                    Scope
                }
            };
        }
    }
}