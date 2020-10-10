using System;
using System.Threading.Tasks;
using Company.IdentityServer.Services.User;
using IdentityServer4;
using IdentityServer4.Events;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PC.Database.Models.Users;
using PC.Domain.Services.Claims;
using PC.Domain.Services.User;
using PC.Models.Users;
using Utils.Exceptions;

namespace Company.IdentityServer.Controllers
{
    [Route("external/")]
    public class ExternalController : ControllerBase
    {
        private readonly IUserServiceForIdentityServer _userService;
        private readonly SignInManager<DbUser> _signInManager;
        private readonly IUserIdentityService _userIdentityService;
        private readonly IEventService _events;

        public ExternalController(
            IUserServiceForIdentityServer userService,
            IUserIdentityService userIdentityService,
            IEventService events,
            SignInManager<DbUser> signInManager)
        {
            _userService = userService;
            _userIdentityService = userIdentityService;
            _events = events;
            _signInManager = signInManager;
        }

        [HttpGet("current-user")]
        public async Task<ApplicationUser> GetCurrentUserAsync()
        {
            return await _userService.UserByEmailOrNullAsync(User.Identity.Name);
        }

        [HttpGet("login-via-google")]
        public IActionResult LoginViaGoogle(string returnUrl)
        {
            var callbackUrl = Url.RouteUrl(nameof(LoginViaGoogleCallbackAsync));
            var props = new AuthenticationProperties
            {
                RedirectUri = callbackUrl,
                Items =
                {
                    { "scheme", GoogleDefaults.AuthenticationScheme },
                    { "returnUrl", returnUrl }
                }
            };

            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-signin-callback", Name = nameof(LoginViaGoogleCallbackAsync))]
        public async Task<IActionResult> LoginViaGoogleCallbackAsync()
        {
            var result = await HttpContext.AuthenticateAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);
            if (result?.Succeeded != true)
            {
                throw new InvalidOperationException("External authentication error");
            }

            if (result.Principal == null)
            {
                throw new InvalidOperationException("External authentication error");
            }

            var externalUser = new ClaimsUser(result.Principal);

            // try to determine the unique id of the external user - the most common claim type for that are the sub claim and the NameIdentifier
            // depending on the external provider, some other claim type might be used
            if (externalUser.Email == null)
            {
                throw new ResourceNotFoundException("Unknown userid");
            }

            // use externalProvider and externalUserId to find your user, or provision a new user
            DbUser user = await _userIdentityService.UserByEmailOrCreateAsync(externalUser);

            await _signInManager.SignInAsync(user, true);
            await _events.RaiseAsync(new UserLoginSuccessEvent(
                username: user.UserName,
                subjectId: user.Id.ToString(),
                name: user.UserName));

            // delete temporary cookie used during external authentication
            await HttpContext.SignOutAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);

            var returnUrl = result.Properties.Items["returnUrl"];
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = Url.Action("Index", "Home");
            }

            return Redirect(returnUrl);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> LogoutAsync()
        {
            var user = HttpContext.User;
            if (user?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                await HttpContext.SignOutAsync();
            }

            return Ok();
        }
    }
}
