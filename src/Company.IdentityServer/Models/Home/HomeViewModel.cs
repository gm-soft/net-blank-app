using PC.Models.Users;
using Utils.Enums;
using Utils.Helpers;

namespace Company.IdentityServer.Models.Home
{
    public class HomeViewModel
    {
        public HomeViewModel()
        {
        }

        public HomeViewModel(string username)
        {
            username.ThrowIfNullOrEmpty(nameof(username));

            HasLoggedUser = true;
            Email = username;
        }

        public bool HasLoggedUser { get; set; }

        public string Email { get; set; }
    }
}