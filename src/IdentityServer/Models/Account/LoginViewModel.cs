namespace IdentityServer.Models.Account
{
    public class LoginViewModel : LoginInputModel
    {
        public bool AllowRememberLogin { get; set; } = true;

        public bool ShowDevelopmentOptions { get; set; } = false;
    }
}