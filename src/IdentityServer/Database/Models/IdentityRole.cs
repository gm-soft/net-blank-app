using Microsoft.AspNetCore.Identity;
using Utils.Enums;

namespace IdentityServer.Database.Models
{
    public class IdentityRole : IdentityRole<long>
    {
        public Role Role { get; set; }
    }
}