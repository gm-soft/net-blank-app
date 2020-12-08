using System.Threading.Tasks;
using IdentityServer.Database.Models;
using IdentityServer.Infrastructure.Services.User;
using Microsoft.AspNetCore.Identity;
using Utils.Validators;

namespace IdentityServerTest.Utils
{
    /// <summary>
    /// This stub is used for test purposes. There is no way to mock User.AnyAsync operation, so we had to create
    /// a method <see cref="HasAnyUserAsync"/> and override it in unittests.
    /// </summary>
    public class UserIdentityServiceStub : UserIdentityService
    {
        private readonly bool _hasAnyOtherUser;

        public UserIdentityServiceStub(
            UserManager<User> userManager,
            EmailDomainValidatorService emailDomainValidatorService,
            bool hasAnyOtherUser)
            : base(userManager, emailDomainValidatorService)
        {
            _hasAnyOtherUser = hasAnyOtherUser;
        }

        protected override Task<bool> HasAnyUserAsync() => Task.FromResult(_hasAnyOtherUser);
    }
}