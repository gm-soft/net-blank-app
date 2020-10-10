using System;
using System.Collections.Generic;
using System.Text;
using PC.Models.Users;

namespace PC.Services.Email
{
    public interface IInvitationUrlProvider
    {
        string GetInvitationUrl();
    }
}