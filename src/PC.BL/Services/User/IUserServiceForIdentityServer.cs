using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Users;
using Utils.Enums;

namespace PC.Services.User
{
    public interface IUserServiceForIdentityServer
    {
        Task<Role> RoleOfUserAsync(long userId);

        Task<IReadOnlyCollection<ApplicationUser>> UsersWithRoleAsync();

        Task<ApplicationUser> UserByEmailOrNullAsync(string email);
    }
}