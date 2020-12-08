using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Health;

namespace Core.Api.Controllers.Tools
{
    [ApiController]
    [Route("api/app-info")]
    [AllowAnonymous]
    public class AppInfoController : Controller
    {
        /// <summary>
        /// Returns application version and a date when the app was created.
        /// </summary>
        /// <returns>Version and date of creation.</returns>
        [HttpGet("")]
        public IActionResult Info()
        {
            return Ok(new WebAppInfo<Startup>());
        }
    }
}