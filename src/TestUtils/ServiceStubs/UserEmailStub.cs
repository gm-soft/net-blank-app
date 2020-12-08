using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Services.Users.Email;
using PC.Models.Users;

namespace TestUtils.ServiceStubs
{
    public class UserEmailStub : IUserEmail
    {
        public int SendInviteEmailAsyncInvocations { get; private set; }

        public int SendCompanyWideInviteEmailInvocations { get; private set; }

        public Task SendInviteEmailAsync(User user, User currentUser = null)
        {
            SendInviteEmailAsyncInvocations++;

            return Task.CompletedTask;
        }

        public Task SendCompanyWideInviteEmailAsync(IReadOnlyCollection<string> emails, User currentUser)
        {
            SendCompanyWideInviteEmailInvocations++;

            return Task.CompletedTask;
        }
    }
}