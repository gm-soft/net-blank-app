using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using IdentityServer.Database.Models;
using Utils.Helpers;

namespace IdentityServer.Models.Account
{
    public class LoginAsAnotherPersonViewModel
    {
        // empty ctor for app auto initialization.
        public LoginAsAnotherPersonViewModel()
        {
        }

        public LoginAsAnotherPersonViewModel(IReadOnlyCollection<User> usernames, string returnUrl)
            : this(usernames, returnUrl, default)
        {
        }

        public LoginAsAnotherPersonViewModel(
            IReadOnlyCollection<User> usernames, string returnUrl, long selectedUserId)
        {
            usernames.ThrowIfNull(nameof(usernames));

            Usernames = usernames.Select(x => new UserForSelectBox(x)).ToArray();
            ReturnUrl = returnUrl;
            SelectedUserId = selectedUserId;
        }

        public IReadOnlyCollection<UserForSelectBox> Usernames { get; }

        [Required]
        public long SelectedUserId { get; set; }

        public string ReturnUrl { get; set; }
    }
}