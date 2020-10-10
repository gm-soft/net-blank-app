using System.Threading.Tasks;
using PC.Database.Models.Users;
using PC.Domain.Services.Claims;

namespace Company.IdentityServer.Services.User
{
    public interface IUserIdentityService
    {
        Task<DbUser> UserByEmailOrCreateAsync(ClaimsUser claimsUser);
    }
}