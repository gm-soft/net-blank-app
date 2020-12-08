using System.Threading.Tasks;
using IdentityServer.Infrastructure.Security;
using IdentityServer.Models;
using IdentityServer.Models.Home;
using IdentityServer4.Extensions;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using Web.Health;

namespace IdentityServer.Controllers
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
            var viewModel = User != null && User.IsAuthenticated()
                ? new HomeViewModel(User.Identity.Name)
                : new HomeViewModel();

            return View("Index", viewModel);
        }

        [HttpGet("info")]
        public IActionResult Info()
        {
            return Ok(new WebAppInfo<Startup>());
        }

        /// <summary>
        /// Shows the error page.
        /// </summary>
        /// <param name="errorId">Error Id.</param>
        /// <returns>Action result.</returns>
#pragma warning disable UseAsyncSuffix
        public async Task<IActionResult> Error(string errorId)
#pragma warning restore UseAsyncSuffix
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