using Utils.Helpers;

namespace IdentityServer.Models.Home
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
            Username = username;
        }

        public bool HasLoggedUser { get; }

        public string Username { get; }
    }
}