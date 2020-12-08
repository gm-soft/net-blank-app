using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Dtos.Users;
using PC.Models.Users;
using Utils.Pagination;

namespace Domain.Services.Users
{
    public interface IUserService
    {
        Task<User> GetByIdAsync(long id);

        Task<IReadOnlyCollection<User>> GetAllAsync();

        Task<long> InsertAsync(UserDto data);

        Task DeleteAsync(long id);

        Task<User> GetByIdIncludingInactiveAsync(long userId);

        Task<PaginatedList<User>> GetAllAsync(PageModel pageModel);

        Task<PaginatedList<User>> InactiveUsersAsync(PageModel pageModel);

        Task<int> ImportAsync(IReadOnlyCollection<UserDto> users);

        Task<PaginatedList<User>> SearchAsync(string searchString, PageModel pageModel);

        Task ResendInviteEmailAsync(long userId);

        Task<int> SendInviteEmailsAsync();

        Task<int> SendCompanyWideInviteEmailAsync();

        Task RemoveUserFromDatabaseAsync(long id);

        Task<int> RemoveNonConfirmedUsersFromDatabaseAsync();

        Task UpdateAsync(UserDto user);
    }
}