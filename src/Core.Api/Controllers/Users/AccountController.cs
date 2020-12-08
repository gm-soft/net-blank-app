using System.Linq;
using System.Threading.Tasks;
using Core.Api.Attributes;
using Domain.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using PC.Models.Users;
using Utils.Enums;

namespace Core.Api.Controllers.Users
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
        public async Task<User> GetMeAsync()
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