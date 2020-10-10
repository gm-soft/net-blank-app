using System.Threading.Tasks;
using PC.Domain.Services.Auth;
using PC.Domain.Services.Email.Models;
using Utils.Interfaces;

namespace PC.Domain.Services.Email
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