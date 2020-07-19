using System.Security.Claims;
using System.Threading.Tasks;
using Company.IdentityServer.Models;
using Company.IdentityServer.Models.Home;
using Company.IdentityServer.Security;
using IdentityServer4.Extensions;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using PC.Models.Users;

namespace Company.IdentityServer.Controllers
{
    [SecurityHeaders]
    public class HomeController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;

        public HomeController(IIdentityServerInteractionService interaction)
        {
            _interaction = interaction;
        }

        public IActionResult Index()
        {
            ClaimsPrincipal user = User;

            var viewModel = new HomeViewModel
            {
                HasLoggedUser = User != null && User.IsAuthenticated()
            };

            if (viewModel.HasLoggedUser)
            {
                viewModel.LoggedUser = new ApplicationUser(user);
            }

            return View("Index", viewModel);
        }

        /// <summary>
        /// Shows the error page.
        /// </summary>
        /// <param name="errorId">Error Id.</param>
        /// <returns>Action result.</returns>
        [HttpGet("error")]
        public async Task<IActionResult> ErrorAsync(string errorId)
        {
            var vm = new ErrorViewModel();

            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);
            if (message != null)
            {
                vm.Error = message;
            }

            return View("Error", vm);
        }
    }
}