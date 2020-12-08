using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace IdentityServerTest.Utils
{
    public class UserManagerStub : UserManager<User>
    {
        private readonly IdentityResult _createResult;
        private readonly IdentityResult _roleAddingResult;
        private readonly Action<User, string> _roleAddCheckAction;
        private readonly IdentityResult _claimsAddingResult;

        public UserManagerStub(
            IdentityResult createResult,
            IdentityResult roleAddingResult,
            Action<User, string> roleAddCheckAction,
            IdentityResult claimsAddingResult)
            : base(
                store: CreateMock<IUserStore<User>>(),
                optionsAccessor: CreateMock<IOptions<IdentityOptions>>(),
                passwordHasher: CreateMock<IPasswordHasher<User>>(),
                userValidators: Enumerable.Empty<IUserValidator<User>>(),
                passwordValidators: Enumerable.Empty<IPasswordValidator<User>>(),
                keyNormalizer: CreateMock<ILookupNormalizer>(),
                errors: CreateMock<IdentityErrorDescriber>(),
                services: CreateMock<IServiceProvider>(),
                logger: CreateMock<ILogger<UserManager<User>>>())
        {
            _createResult = createResult;
            _roleAddingResult = roleAddingResult;
            _roleAddCheckAction = roleAddCheckAction;
            _claimsAddingResult = claimsAddingResult;
        }

        public override Task<IdentityResult> CreateAsync(User user)
        {
            return Task.FromResult(_createResult);
        }

        public override Task<IdentityResult> AddToRoleAsync(User user, string role)
        {
            _roleAddCheckAction(user, role);

            return Task.FromResult(_roleAddingResult);
        }

        public override Task<IdentityResult> AddClaimsAsync(User user, IEnumerable<Claim> claims)
        {
            return Task.FromResult(_claimsAddingResult);
        }

        private static T CreateMock<T>()
            where T : class
        {
            return new Mock<T>().Object;
        }
    }
}