using System.Security.Claims;

namespace PC.Services.Auth
{
    public interface IUserClaimsProvider
    {
        bool WithinWebRequest();

        ClaimsPrincipal GetUserClaims();
    }
}