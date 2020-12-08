using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Database.Repositories.Base;
using PC.Models.Records.Users;
using PC.Models.Users;
using Utils.Enums;
using Utils.Pagination;

namespace Database.Repositories.Users
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByIdIncludingInactiveAsync(long userId);

        Task<PaginatedList<User>> GetAllAsync(PageModel pageModel);

        Task<User> GetByUsernameOrNullAsync(IdentityUser data);

        Task<User> CreateUserAsync(IdentityUser data);

        Task<User> FirstUserWithRoleOrNullAsync(Role role);

        Task<bool> CheckHasUserWithUsernameAsync(string userName);

        Task InsertAsync(IReadOnlyCollection<User> users);

        Task<PaginatedList<User>> InactiveUsersAsync(PageModel pageModel);

        Task<PaginatedList<User>> SearchAsync(string searchString, PageModel pageModel);

        Task<IReadOnlyCollection<User>> GetNonConfirmedUsersAsync();

        Task<IReadOnlyCollection<string>> ActiveUsersEmailsAsync();

        Task RemoveInactiveUserFromDatabaseAsync(long id);

        Task<int> RemoveNonConfirmedUsersFromDatabaseAsync();
    }
}