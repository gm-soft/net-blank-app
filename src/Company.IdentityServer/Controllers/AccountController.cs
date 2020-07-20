﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Company.IdentityServer.Extensions;
using Company.IdentityServer.Models.Account;
using IdentityServer4.Events;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using PC.Database.Models.Users;
using PC.Models.Users;
using PC.Services.User;
using Utils.Enums;
using Utils.Exceptions;

namespace Company.IdentityServer.Controllers
{
    [Route("account")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class AccountController : Controller
    {
        private readonly SignInManager<DbUser> _signInManager;
        private readonly UserManager<DbUser> _userManager;
        private readonly IClientStore _clientStore;
        private readonly IEventService _events;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IUserServiceForIdentityServer _userService;
        private readonly bool _allowAnotherUserLoginOption;

        public AccountController(
            SignInManager<DbUser> signInManager,
            UserManager<DbUser> userManager,
            IClientStore clientStore,
            IEventService events,
            IIdentityServerInteractionService interaction,
            IHostEnvironment hostEnvironment,
            IUserServiceForIdentityServer userService,
            IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _clientStore = clientStore;
            _events = events;
            _interaction = interaction;
            _hostEnvironment = hostEnvironment;
            _userService = userService;

            _allowAnotherUserLoginOption = bool.Parse(configuration["AllowAnotherUserLoginOption"]);
        }

        /// <summary>
        /// Entry point into the login workflow.
        /// </summary>
        /// <param name="returnUrl">Return Url.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpGet]
        [Route("login")]
        public async Task<IActionResult> LoginAsync(string returnUrl)
        {
            // build a model so we know what to show on the login page
            LoginViewModel vm = await BuildLoginViewModelAsync(returnUrl);

            return View("Login", vm);
        }

        [HttpGet]
        [Route("login-as-another-user")]
#pragma warning disable UseAsyncSuffix
        public async Task<IActionResult> LoginAsAnotherUser(string returnUrl)
#pragma warning restore UseAsyncSuffix
        {
            if (!LoginAsAnotherUserOpportunityAvailable())
            {
                return NotFound();
            }

            IReadOnlyCollection<ApplicationUser> users = await _userService.UsersWithRoleAsync();
            var vm = new LoginAsAnotherPersonViewModel(users, returnUrl);

            return View("LoginAsAnotherPerson", vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("login-as-another-user")]
        public async Task<IActionResult> LoginAsAnotherUserAsync(LoginAsAnotherPersonViewModel model, string button)
        {
            if (!LoginAsAnotherUserOpportunityAvailable())
            {
                return NotFound();
            }

            // check if we are in the context of an authorization request
            AuthorizationRequest context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            // the user clicked the "cancel" button
            if (button != "login")
            {
                return await RedirectToLoginPageAsync(context, model.ReturnUrl);
            }

            if (ModelState.IsValid)
            {
                DbUser user = await _userManager.FindByIdAsync(model.SelectedUserId.ToString());

                if (user != null)
                {
                    await ValidateUserAsync(user);

                    // It 's necessary to update security stamp, otherwise we get an exception
                    await _userManager.UpdateSecurityStampAsync(user);
                    await _signInManager.SignInAsync(user, isPersistent: true);

                    await _events.RaiseAsync(new UserLoginSuccessEvent(
                        username: user.UserName,
                        subjectId: user.Id.ToString(),
                        name: user.UserName));

                    return await RedirectToReturnUrlAsync(context, model.ReturnUrl);
                }

                await _events.RaiseAsync(new UserLoginFailureEvent(
                    username: model.SelectedUserId.ToString(),
                    error: "invalid UserId",
                    clientId: context?.Client?.ClientId));

                ModelState.AddModelError(
                    nameof(LoginAsAnotherPersonViewModel.SelectedUserId),
                    "Invalid username or password");
            }

            IReadOnlyCollection<ApplicationUser> users = await _userService.UsersWithRoleAsync();
            var vm = new LoginAsAnotherPersonViewModel(users, model.ReturnUrl, model.SelectedUserId);

            return View("LoginAsAnotherPerson", vm);
        }

        /// <summary>
        /// Handle logout page postback.
        /// </summary>
        /// <param name="logoutId">Logout Id.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpGet]
        [Route("logout")]
        public async Task<IActionResult> LogoutAsync(string logoutId)
        {
            return Redirect(await LogoutInternalAsync(logoutId));
        }

        /// <summary>
        /// Handle logout page postback.
        /// </summary>
        /// <param name="logoutId">Logout Id.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpGet]
        [Route("logout-spa")]
        public async Task<IActionResult> LogoutSpaAsync(string logoutId)
        {
            return Ok(new
            {
                redirectUrl = await LogoutInternalAsync(logoutId)
            });
        }

        private async Task<string> LogoutInternalAsync(string logoutId)
        {
            var defaultUrlToRedirect = Url.Action("Index", "Home");

            if (HttpContext.User != null && _signInManager.IsSignedIn(HttpContext.User))
            {
                await _signInManager.SignOutAsync();
                await HttpContext.SignOutAsync();
                LogoutRequest context = await _interaction.GetLogoutContextAsync(logoutId);
                return context.PostLogoutRedirectUri ?? defaultUrlToRedirect;
            }

            return defaultUrlToRedirect;
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);

            return new LoginViewModel
            {
                AllowRememberLogin = true,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint,
                ShowDevelopmentOptions = LoginAsAnotherUserOpportunityAvailable()
            };
        }

        private bool LoginAsAnotherUserOpportunityAvailable()
        {
            return (_hostEnvironment.IsDevelopment() || _hostEnvironment.IsStaging()) && _allowAnotherUserLoginOption;
        }

        private async Task ValidateUserAsync(DbUser user)
        {
            Role role = await _userService.RoleOfUserAsync(user.Id);

            if (role == Role.SystemAdministrator)
            {
                throw new NoPermissionsException($"Nobody is able to log in as {Role.SystemAdministrator}");
            }
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }

        // Warning! This redirect was copypasted from
        // https://github.com/IdentityServer/IdentityServer4.Demo/blob/master/src/IdentityServer4Demo/Quickstart/Account/AccountController.cs
        private Task<IActionResult> RedirectToLoginPageAsync(AuthorizationRequest context, string returnUrl)
        {
            if (context != null)
            {
                throw new NotSupportedException();
            }

            // since we don't have a valid context, then we just go back to the home page
            return Task.FromResult((IActionResult)Redirect("~/account/login"));
        }

        // Warning! This redirect was copypasted from
        // https://github.com/IdentityServer/IdentityServer4.Demo/blob/master/src/IdentityServer4Demo/Quickstart/Account/AccountController.cs
        private Task<IActionResult> RedirectToReturnUrlAsync(AuthorizationRequest context, string returnUrl)
        {
            if (context != null)
            {
                throw new NotSupportedException();
            }

            // request for a local page
            if (Url.IsLocalUrl(returnUrl))
            {
                return Task.FromResult((IActionResult)Redirect(returnUrl));
            }

            if (string.IsNullOrEmpty(returnUrl))
            {
                return Task.FromResult((IActionResult)Redirect("~/"));
            }

            // user might have clicked on a malicious link - should be logged
            throw new InvalidOperationException("invalid return URL");
        }
    }
}