using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Emails;
using Domain.Emails.Models;
using Domain.Services.Auth;
using PC.Models.Users;
using Utils.Helpers;
using Utils.Interfaces;

namespace Domain.Services.Users.Email
{
    public class UserEmail : IUserEmail
    {
        private readonly IEmailSender _emailSender;
        private readonly IViewRenderer _viewRenderer;
        private readonly IAuthorizationManager _authManager;
        private readonly IBaseUrls _urls;

        public UserEmail(
        IEmailSender emailSender, IViewRenderer viewRenderer, IAuthorizationManager authManager, IBaseUrls urls)
        {
            emailSender.ThrowIfNull(nameof(emailSender));
            viewRenderer.ThrowIfNull(nameof(viewRenderer));

            _emailSender = emailSender;
            _viewRenderer = viewRenderer;
            _authManager = authManager;
            _urls = urls;
        }

        public async Task SendInviteEmailAsync(User user, User currentUser = null)
        {
            currentUser ??= await _authManager.GetCurrentUserAsync();

            await _emailSender.SendSingleEmailAsync(
                await new UserInvitationEmail(
                    user: user,
                    currentUser: currentUser,
                    urls: _urls,
                    renderer: _viewRenderer)
                    .RenderAsync());
        }

        public Task SendCompanyWideInviteEmailAsync(IReadOnlyCollection<string> emails, User currentUser)
        {
            return Task.CompletedTask;
        }
    }
}
