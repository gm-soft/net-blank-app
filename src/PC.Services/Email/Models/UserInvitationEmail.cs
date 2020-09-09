using PC.Models.Users;
using PC.Services.Email.Models.CallToActions;
using Utils.Interfaces;

namespace PC.Services.Email.Models
{
    public class UserInvitationEmail : NoReplyEmail
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public UserInvitationEmail(ApplicationUser user, IBaseUrls urls, IViewRenderer renderer)
            : base(renderer, urls, new CallToActionButton("Get some magic", new MainPageLink(urls.BaseUrl)))
        {
            FirstName = user.FirstName;
            FirstName = user.FirstName;

            Recipients.Add(user.Email);
        }

        protected override string Subject => "Invitation letter";

        protected override string ViewPath => "/Content/EmailTemplates/Invitation.cshtml";
    }
}