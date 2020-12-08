using System.Collections.Generic;
using System.Threading.Tasks;
using IdentityServer.Database.Models;
using Utils.Enums;

namespace IdentityServer.Infrastructure.Services.User
{
    public interface IUserServiceForIdentityServer
    {
        Task<bool> HasEntityAsync(long id);

        Task<UserWithRole> UserOrFailAsync(long id);

        Task<Role> RoleOfUserAsync(long userId);

        Task<IReadOnlyCollection<Database.Models.User>> UsersWithRoleAsync();

        Task<Database.Models.User> UserByUserNameOrNullAsync(string email);

        Task UpdateAsync(Database.Models.User user);

        Task DeleteAsync(string userName);

        Task RemoveAsync(string userName);
    }
}