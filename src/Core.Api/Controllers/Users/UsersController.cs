using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Api.Attributes;
using Domain.Dtos.Users;
using Domain.Services.Users;
using Microsoft.AspNetCore.Mvc;
using PC.Models.Users;
using Utils.Enums;
using Utils.Pagination;

namespace Core.Api.Controllers.Users
{
    [Route("api/users/")]
    [ApiController]
    [RoleAuthorize(Role.Employee)]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns a single User by a passed id.
        /// </summary>
        /// <param name="id">User id.</param>
        /// <returns>User.</returns>
        [HttpGet("{id}")]
        public async Task<User> GetByIdAsync([FromRoute] long id)
        {
            return await _service.GetByIdAsync(id);
        }

        /// <summary>
        /// Returns all entities.
        /// </summary>
        /// <returns>All entities.</returns>
        [HttpGet("")]
        public async Task<IReadOnlyCollection<User>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        /// <summary>
        /// Creates a new entity from a passed data.
        /// </summary>
        /// <param name="model">Instance to create.</param>
        /// <returns>Ok.</returns>
        [HttpPost]
        public virtual async Task<IActionResult> CreateAsync([FromBody] UserDto model)
        {
            await _service.InsertAsync(model);
            return Ok();
        }

        /// <summary>
        /// Updates an existing entity with a passed data.
        /// </summary>
        /// <param name="model">Instance to update.</param>
        /// <returns>Ok.</returns>
        [HttpPut("")]
        public virtual async Task<IActionResult> UpdateAsync([FromBody] UserDto model)
        {
            await _service.UpdateAsync(model);
            return Ok();
        }

        [HttpGet("paginated-list")]
        public async Task<PaginatedList<User>> GetAllAsync([FromQuery]PageModel pageModel)
        {
            return await _service.GetAllAsync(pageModel);
        }

        [HttpGet("inactive-users")]
        public async Task<PaginatedList<User>> InactiveUsersAsync([FromQuery]PageModel pageModel)
        {
            return await _service.InactiveUsersAsync(pageModel);
        }

        /// <summary>
        /// Search and returns user including inactive ones.
        /// </summary>
        /// <param name="id">UserId.</param>
        /// <returns>User.</returns>
        [HttpGet("for-admin/{id}")]
        [RoleAuthorize(Role.HRManager)]
        public async Task<User> GetByIdIncludingInactiveAsync([FromRoute] long id)
        {
            return await _service.GetByIdIncludingInactiveAsync(id);
        }

        [HttpDelete("{id}")]
        [RoleAuthorize(Role.HRManager)]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }

        [HttpDelete("remove-user-from-database/{id}")]
        [RoleAuthorize(Role.SystemAdministrator)]
        public async Task<IActionResult> RemoveUserFromDatabaseAsync(long id)
        {
            await _service.RemoveUserFromDatabaseAsync(id);
            return Ok();
        }

        [HttpPost("import")]
        [RoleAuthorize(Role.TopManager)]
        public async Task<IActionResult> ImportUsersAsync([FromBody] IReadOnlyCollection<UserDto> users)
        {
            int count = await _service.ImportAsync(users);
            return Ok(count);
        }

        [HttpPost("resend-invite-email/{id}")]
        [RoleAuthorize(Role.HRManager)]
        public async Task<IActionResult> ResendInviteEmailAsync([FromRoute] long id)
        {
            await _service.ResendInviteEmailAsync(id);
            return Ok();
        }

        /// <summary>
        /// Returns users that fit to passed query.
        /// </summary>
        /// <param name="q">Search query.</param>
        /// <param name="pageModel">Search querxxxy.</param>
        /// <returns>Users.</returns>
        [HttpGet("search")]
        public async Task<PaginatedList<User>> SearchAsync([FromQuery]string q, [FromQuery]PageModel pageModel)
        {
            return await _service.SearchAsync(q, pageModel);
        }
    }
}