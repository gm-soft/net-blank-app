namespace Company.IdentityServer.Models.Account
{
    public class RedirectViewModel
    {
        public RedirectViewModel()
        {
        }

        public RedirectViewModel(string redirectUrl)
        {
            RedirectUrl = redirectUrl;
        }

        public string RedirectUrl { get; set; }
    }
}