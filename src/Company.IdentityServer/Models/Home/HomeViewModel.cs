using PC.Models.Users;
using Utils.Enums;

namespace Company.IdentityServer.Models.Home
{
    public class HomeViewModel
    {
        public bool HasLoggedUser { get; set; }

        public ApplicationUser LoggedUser { get; set; }

        public bool IsAdmin => LoggedUser?.Role == Role.SystemAdministrator;
    }
}