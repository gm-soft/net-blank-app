using System.Threading.Tasks;
using Domain.Emails.Models;
using Domain.Services.Auth;
using Utils.Interfaces;

namespace Domain.Emails
{
    public class EmailPreviewService : IEmailPreviewService
    {
        private readonly IViewRenderer _view;

        private readonly IAuthorizationManager _authorizationManager;

        private readonly IBaseUrls _url;

        public EmailPreviewService(IViewRenderer view, IAuthorizationManager authorizationManager, IBaseUrls url)
        {
            _view = view;
            _authorizationManager = authorizationManager;
            _url = url;
        }

        public async Task<IEmailContent> InvitationEmailAsync()
        {
            var currentUser = await _authorizationManager.GetCurrentUserAsync();
            return await new UserInvitationEmail(
                user: currentUser,
                currentUser: currentUser,
                urls: _url,
                renderer: _view)
                .RenderAsync();
        }

        public async Task<IEmailContent> CustomEmailAsync(EmailContent emailContent)
        {
            return await new CustomEmail(emailContent, _view, _url).RenderAsync();
        }
    }
}