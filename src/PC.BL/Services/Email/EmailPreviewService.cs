using System.Threading.Tasks;
using PC.Services.Auth;
using PC.Services.Email.Models;
using Utils.Interfaces;

namespace PC.Services.Email
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
            return await new UserInvitationEmail(
                user: await _authorizationManager.GetCurrentUserAsync(),
                urls: _url,
                renderer: _view)
                .RenderAsync();
        }
    }
}