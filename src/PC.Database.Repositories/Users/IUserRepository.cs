using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Database.Models.Users;
using PC.Database.Repositories.Base;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using Utils.Enums;

namespace PC.Database.Repositories.Users
{
    public interface IUserRepository : IRepository<DbUser, ApplicationUser>
    {
        Task<ApplicationUser> GetByEmailOrNullAsync(string email);

        Task<bool> CheckHasUserWithEmailAsync(string email);

        Task<Role> GetUserRoleAsync(long userId);

        Task InsertAsync(IReadOnlyCollection<ApplicationUser> users);

        Task<IReadOnlyCollection<ApplicationUser>> InactiveUsersAsync();

        Task<IReadOnlyCollection<ApplicationUser>> SearchAsync(string searchString);
    }
}