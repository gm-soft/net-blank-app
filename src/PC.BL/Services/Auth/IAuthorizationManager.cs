using System.Threading.Tasks;
using PC.Models.Users;
using Utils.Enums;

namespace PC.Services.Auth
{
    public interface IAuthorizationManager
    {
        Task<ApplicationUser> GetCurrentUserAsync();

        bool HasCurrentUserRole(Role role);

        void HasCurrentUserRoleOrFail(Role role, string message = null);
    }
}