using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using Utils.Enums;

namespace PC.Database.Repositories.Users
{
    public interface IUserRepositoryForIdentity
    {
        Task<Role> RoleOfUserAsync(long userId);

        Task<IReadOnlyCollection<ApplicationUser>> UsersWithRoleAsync();

        Task<ApplicationUser> UserByEmailOrNullAsync(string email);

        Task<bool> HasEntityAsync(long id);

        Task<UserWithRole> UserWithRoleOrFailAsync(long id);
    }
}