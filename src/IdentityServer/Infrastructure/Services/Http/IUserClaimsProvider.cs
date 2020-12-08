using System.Security.Claims;

namespace IdentityServer.Infrastructure.Services.Http
{
    public interface IUserClaimsProvider
    {
        ClaimsPrincipal GetUserClaims();
    }
}