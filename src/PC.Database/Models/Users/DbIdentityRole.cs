using Microsoft.AspNetCore.Identity;
using Utils.Enums;

namespace PC.Database.Models.Users
{
    public class DbIdentityRole : IdentityRole<long>
    {
        public Role Role { get; set; }
    }
}