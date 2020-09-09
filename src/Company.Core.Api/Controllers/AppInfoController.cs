using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PC.BL.Health;

namespace Company.Core.Api.Controllers
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