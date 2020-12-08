using Utils.Enums;

namespace IdentityServer.Database.Models
{
    public class UserWithRole
    {
        public User User { get; set; }

        public Role Role { get; set; }

        public User Get()
        {
            User.Role = Role;
            return User;
        }
    }
}