using System.Threading.Tasks;
using Core.Api.Attributes;
using Domain.Emails;
using Domain.Emails.Models;
using Microsoft.AspNetCore.Mvc;
using Utils.Enums;

namespace Core.Api.Controllers.Emails
{
    [Route("api/email-preview")]
    [ApiController]
    [RoleAuthorize(Role.HRManager)]
    public class EmailPreviewController : ControllerBase
    {
        private readonly IEmailPreviewService _service;

        public EmailPreviewController(IEmailPreviewService service)
        {
            _service = service;
        }

        [HttpGet("user-invitation")]
        public async Task<IEmailContent> InvitationEmailAsync()
        {
            return await _service.InvitationEmailAsync();
        }

        [HttpPost("custom")]
        public async Task<IEmailContent> CustomEmailAsync([FromBody] EmailContent emailContent)
        {
            return await _service.CustomEmailAsync(emailContent);
        }
    }
}