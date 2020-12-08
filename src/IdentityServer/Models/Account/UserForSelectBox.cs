using IdentityServer.Database.Models;

namespace IdentityServer.Models.Account
{
    public class UserForSelectBox
    {
        private readonly User _user;

        public long Id => _user.Id;

        public string Label { get; }

        public UserForSelectBox(User user)
        {
            _user = user;
            Label = $"{_user.UserName} ({_user.Role}";
            Label += _user.DeletedAt == null
                ? ")"
                : ", inactive)";
        }
    }
}