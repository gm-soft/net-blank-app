using System.Threading.Tasks;
using Domain.Emails.Models;
using Domain.Services.Auth;
using Utils.Enums;
using Utils.Interfaces;

namespace Domain.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IEmailSender _emailSender;

        private readonly IAuthorizationManager _authManager;

        private readonly IViewRenderer _view;

        private readonly IBaseUrls _url;

        public EmailService(
            IEmailSender emailSender,
            IAuthorizationManager authManager,
            IViewRenderer viewRenderer,
            IBaseUrls url)
        {
            _emailSender = emailSender;
            _authManager = authManager;
            _view = viewRenderer;
            _url = url;
        }

        public async Task SendCustomEmailAsync(EmailContent emailContent)
        {
            _authManager.HasCurrentUserRoleOrFail(Role.TopManager);
            var customEmail = new CustomEmail(emailContent, _view, _url);

            await _emailSender.SendSingleEmailAsync(await customEmail.RenderAsync());
        }
    }
}
