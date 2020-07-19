using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using PC.Models.Users;
using Utils.Helpers;

namespace Company.IdentityServer.Models.Account
{
    public class LoginAsAnotherPersonViewModel
    {
        // empty ctor for app auto initialization.
        public LoginAsAnotherPersonViewModel()
        {
        }

        public LoginAsAnotherPersonViewModel(IReadOnlyCollection<ApplicationUser> usernames, string returnUrl)
            : this(usernames, returnUrl, default)
        {
        }

        public LoginAsAnotherPersonViewModel(
            IReadOnlyCollection<ApplicationUser> usernames, string returnUrl, long selectedUserId)
        {
            usernames.ThrowIfNull(nameof(usernames));

            Usernames = usernames;
            ReturnUrl = returnUrl;
            SelectedUserId = selectedUserId;
        }

        public IReadOnlyCollection<ApplicationUser> Usernames { get; set; }

        [Required]
        public long SelectedUserId { get; set; }

        public string ReturnUrl { get; set; }
    }
}