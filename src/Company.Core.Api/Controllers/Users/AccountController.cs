using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PC.BL.Attributes;
using PC.Models.Users;
using PC.Services.Auth;
using Utils.Enums;

namespace Company.Core.Api.Controllers.Users
{
    [Route("api/account/")]
    [ApiController]
    [RoleAuthorize(Role.Employee)]
    public class AccountController : ControllerBase
    {
        private readonly IAuthorizationManager _authorizationManager;

        public AccountController(IAuthorizationManager authorizationManager)
        {
            _authorizationManager = authorizationManager;
        }

        /// <summary>
        /// Returns current user if exists.
        /// </summary>
        /// <returns>Current user.</returns>
        [HttpGet("me")]
        public async Task<ApplicationUser> GetMeAsync()
        {
            return await _authorizationManager.GetCurrentUserAsync();
        }

        [HttpGet("get-claims")]
        public IActionResult GetUserClaims()
        {
            return new JsonResult(User.Claims.Select(c => new { c.Type, c.Value }));
        }
    }
}