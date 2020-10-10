using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace PC.Services.Auth
{
    public class UserClaimsProvider : IUserClaimsProvider
    {
        private readonly IHttpContextAccessor _context;

        public UserClaimsProvider(IHttpContextAccessor context)
        {
            _context = context;
        }

        public bool WithinWebRequest()
        {
            return _context.HttpContext != null;
        }

        public ClaimsPrincipal GetUserClaims()
        {
            return _context.HttpContext?.User;
        }
    }
}