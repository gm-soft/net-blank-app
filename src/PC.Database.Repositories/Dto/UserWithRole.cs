using Microsoft.AspNetCore.Identity;
using PC.Database.Models.Users;
using Utils.Enums;

namespace PC.Database.Repositories.Dto
{
    /// <summary>
    /// This class is purposed to load user with role from query with join.
    /// <see cref="IdentityUserRole{TKey}"/> does not contain nested objects, and that's why we have to
    /// write custom queries using this dto-class.
    /// </summary>
    public class UserWithRole
    {
        public DbUser User { get; set; }

        public Role Role { get; set; }
    }
}