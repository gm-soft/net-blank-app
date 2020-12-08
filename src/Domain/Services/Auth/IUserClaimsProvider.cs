using System.Security.Claims;

namespace Domain.Services.Auth
{
    public interface IUserClaimsProvider
    {
        bool WithinWebRequest();

        ClaimsPrincipal GetUserClaims();
    }
}