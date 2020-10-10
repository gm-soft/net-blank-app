using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PC.Domain.Attributes;
using PC.Domain.Services.User;
using PC.Models.Users;
using Utils.Enums;

namespace Company.Core.Api.Controllers.Users
{
    [Route("api/users/")]
    [ApiController]
    [RoleAuthorize(Role.Employee)]
    public class UsersController : BaseRestController<ApplicationUser, IUserService>
    {
        public UsersController(IUserService userService)
            : base(userService)
        {
        }

        /// <summary>
        /// Returns a single User by a passed id.
        /// </summary>
        /// <param name="id">User id.</param>
        /// <returns>User.</returns>
        [HttpGet("{id}")]
        public override async Task<IActionResult> GetByIdAsync([FromRoute] long id)
        {
            ApplicationUser user = await Service.GetByIdAsync(id);
            return Ok(user);
        }

        [HttpDelete("{id}")]
        [RoleAuthorize(Role.SystemAdministrator)]
        public override Task<IActionResult> DeleteAsync(long id)
        {
            return base.DeleteAsync(id);
        }

        [HttpPost("import")]
        [RoleAuthorize(Role.TopManager)]
        public async Task<IActionResult> ImportUsersAsync([FromBody] IReadOnlyCollection<ApplicationUser> users)
        {
            int count = await Service.ImportAsync(users);
            return Ok(count);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync([FromQuery]string q)
        {
            return Ok(await Service.SearchAsync(q));
        }
    }
}