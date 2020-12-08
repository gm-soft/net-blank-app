using System.Threading.Tasks;
using Core.Api.Attributes;
using Core.Api.Dtos;
using Domain.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Utils.Enums;

namespace Core.Api.Controllers.Tools
{
    [Route("api/admin-jobs/")]
    [ApiController]
    [RoleAuthorize(Role.SystemAdministrator)]
    public class JobController : ControllerBase
    {
        private readonly IUserService _userService;

        public JobController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Removes all not-confirmed users from the system.
        /// </summary>
        /// <returns>Removed users count.</returns>
        [HttpDelete("remove-non-confirmed-users-from-database")]
        public async Task<JobResult> RemoveNonConfirmedUsersFromDatabaseAsync()
        {
            return new JobResult(await _userService.RemoveNonConfirmedUsersFromDatabaseAsync());
        }

        /// <summary>
        /// Sends invitation emails to all users who is not confirmed.
        /// </summary>
        /// <returns>Emails count.</returns>
        [HttpPost("send-invite-emails")]
        public async Task<JobResult> SendInviteEmailsAsync()
        {
            return new JobResult(await _userService.SendInviteEmailsAsync());
        }

        /// <summary>
        /// Sends invitation emails to all users who is not confirmed.
        /// </summary>
        /// <returns>Emails count.</returns>
        [HttpPost("send-company-wide-invite-email")]
        public async Task<JobResult> CompanyWideInvitationAsync()
        {
            return new JobResult(await _userService.SendCompanyWideInviteEmailAsync());
        }
    }
}