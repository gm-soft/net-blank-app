using System.Threading.Tasks;
using Core.Api.Attributes;
using Domain.Emails;
using Domain.Emails.Models;
using Microsoft.AspNetCore.Mvc;
using Utils.Enums;

namespace Core.Api.Controllers.Emails
{
    [Route("api/email")]
    [RoleAuthorize(Role.TopManager)]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task SendEmailAsync([FromBody] EmailContent emailContent)
        {
            await _emailService.SendCustomEmailAsync(emailContent);
        }
    }
}