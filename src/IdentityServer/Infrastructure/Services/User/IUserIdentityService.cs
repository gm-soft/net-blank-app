using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.Claims;

namespace IdentityServer.Infrastructure.Services.User
{
    public interface IUserIdentityService
    {
        Task<Database.Models.User> UserByEmailOrCreateAsync(GoogleClaims claimsUser);
    }
}