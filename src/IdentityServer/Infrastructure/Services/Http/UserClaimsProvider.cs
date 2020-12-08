using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace IdentityServer.Infrastructure.Services.Http
{
    public class UserClaimsProvider : IUserClaimsProvider
    {
        private readonly IHttpContextAccessor _context;

        public UserClaimsProvider(IHttpContextAccessor context)
        {
            _context = context;
        }

        public ClaimsPrincipal GetUserClaims()
        {
            return _context.HttpContext?.User;
        }
    }
}