using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Users;

namespace Domain.Services.Users.Email
{
    public interface IUserEmail
    {
        Task SendInviteEmailAsync(User user, User currentUser = null);

        Task SendCompanyWideInviteEmailAsync(IReadOnlyCollection<string> emails, User currentUser);
    }
}
