using System.Threading.Tasks;
using PC.Models.Users;
using Utils.Enums;

namespace Domain.Services.Auth
{
    public interface IAuthorizationManager
    {
        Task<User> GetCurrentUserAsync();

        bool HasCurrentUserRole(Role role);

        void HasCurrentUserRoleOrFail(Role role, string message = null);
    }
}