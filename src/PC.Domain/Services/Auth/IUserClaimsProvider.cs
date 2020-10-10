using System.Security.Claims;

namespace PC.Domain.Services.Auth
{
    public interface IUserClaimsProvider
    {
        bool WithinWebRequest();

        ClaimsPrincipal GetUserClaims();
    }
}