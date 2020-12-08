using Utils.Enums;
using Utils.Helpers;

namespace PC.Models.Users
{
    public class IdentityUserRole
    {
        // for ef core
        protected IdentityUserRole()
        {
        }

        public IdentityUserRole(long userId, Role role)
        {
            UserId = userId;
            RoleId = (long)role;
        }

        /// <summary>
        /// Gets or sets the primary key of the user that is linked to a role.
        /// </summary>
        public long UserId { get; set; }

        public virtual User User { get; set; }

        /// <summary>
        /// Gets or sets the primary key of the role that is linked to the user.
        /// </summary>
        public long RoleId { get; set; }

        public virtual IdentityRole Role { get; set; }

        public static explicit operator Role(IdentityUserRole role)
        {
            role.ThrowIfNull(nameof(role));
            return (Role)role.RoleId;
        }

        public bool Equals(Role role)
        {
            return role == (Role)this;
        }
    }
}