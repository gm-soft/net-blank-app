using Domain.Emails.Models.CallToActions;
using PC.Models.Users;
using Utils.Helpers;
using Utils.Interfaces;

namespace Domain.Emails.Models
{
    public class UserInvitationEmail : NoReplyEmail
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public UserInvitationEmail(
            User user, User currentUser, IBaseUrls urls, IViewRenderer renderer)
            : base(renderer, urls, new CallToActionButton("Get some magic", new MainPageLink(urls.BaseUrl)))
        {
            user.ThrowIfNull(nameof(user));
            currentUser.ThrowIfNull(nameof(currentUser));

            FirstName = user.FirstName;
            LastName = user.LastName;

            Recipients.Add(user.Email);
            HiddenCc.Add(currentUser.Email);
        }

        protected override string Subject => "Invitation letter";

        protected override string ViewPath => "/Content/EmailTemplates/Invitation.cshtml";
    }
}