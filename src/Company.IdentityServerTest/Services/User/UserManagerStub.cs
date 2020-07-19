using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using PC.Database.Models.Users;

namespace Company.IdentityServerTest.Services.User
{
    public class UserManagerStub : UserManager<DbUser>
    {
        private readonly IdentityResult _createResult;
        private readonly IdentityResult _roleAddingResult;
        private readonly Action<DbUser, string> _roleAddCheckAction;
        private readonly IdentityResult _claimsAddingResult;

        public UserManagerStub(
            IdentityResult createResult,
            IdentityResult roleAddingResult,
            Action<DbUser, string> roleAddCheckAction,
            IdentityResult claimsAddingResult)
            : base(
                store: CreateMock<IUserStore<DbUser>>(),
                optionsAccessor: CreateMock<IOptions<IdentityOptions>>(),
                passwordHasher: CreateMock<IPasswordHasher<DbUser>>(),
                userValidators: Enumerable.Empty<IUserValidator<DbUser>>(),
                passwordValidators: Enumerable.Empty<IPasswordValidator<DbUser>>(),
                keyNormalizer: CreateMock<ILookupNormalizer>(),
                errors: CreateMock<IdentityErrorDescriber>(),
                services: CreateMock<IServiceProvider>(),
                logger: CreateMock<ILogger<UserManager<DbUser>>>())
        {
            _createResult = createResult;
            _roleAddingResult = roleAddingResult;
            _roleAddCheckAction = roleAddCheckAction;
            _claimsAddingResult = claimsAddingResult;
        }

        public override Task<IdentityResult> CreateAsync(DbUser user)
        {
            return Task.FromResult(_createResult);
        }

        public override Task<IdentityResult> AddToRoleAsync(DbUser user, string role)
        {
            _roleAddCheckAction(user, role);

            return Task.FromResult(_roleAddingResult);
        }

        public override Task<IdentityResult> AddClaimsAsync(DbUser user, IEnumerable<Claim> claims)
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