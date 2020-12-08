using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Database.Repositories.Users;
using Domain.Exceptions;
using PC.Models.Records.Users;
using PC.Models.Users;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;

namespace Domain.Services.Auth
{
    public class Authorization : IAuthorizationManager
    {
        private readonly IdentityUser _identityUser;
        private readonly IUserRepository _userRepository;
        private readonly bool _executionWithinBackgroundTask;

        private User _applicationUser;

        public Authorization(
            IUserClaimsProvider claimsProvider, IUserRepository userRepository)
        {
            _userRepository = userRepository;

            if (claimsProvider.WithinWebRequest())
            {
                _executionWithinBackgroundTask = false;

                ClaimsPrincipal claims = claimsProvider.GetUserClaims();

                if (!claims.HasClaims())
                {
                    throw new NoPermissionsException("Web request has no claims");
                }

                _identityUser = new IdentityUser(claims);
            }
            else
            {
                _executionWithinBackgroundTask = true;
            }
        }

        public async Task<User> GetCurrentUserAsync()
        {
            if (_applicationUser == null)
            {
                if (_executionWithinBackgroundTask)
                {
                    throw new InvalidOperationException("The current user is not available within background class");
                }

                _applicationUser = await FindOrCreateAsync();
            }

            return _applicationUser;
        }

        public bool HasCurrentUserRole(Role role) => CurrentUserRoleFromClaims() >= role;

        public void HasCurrentUserRoleOrFail(Role role, string message = null)
        {
            if (!HasCurrentUserRole(role))
            {
                message ??= "Current user has no permission to do this operation";
                throw new NoPermissionsException(message);
            }
        }

        private Role CurrentUserRoleFromClaims()
        {
            if (_executionWithinBackgroundTask)
            {
                return Role.System;
            }

            return _identityUser.Role;
        }

        private async Task<User> FindOrCreateAsync()
        {
            var user = await _userRepository.GetByUsernameOrNullAsync(_identityUser);

            if (user == null)
            {
                return await _userRepository.CreateUserAsync(_identityUser);
            }

            // The mismatch identities may tell us that the User Identity id either IS user Username was changed.
            // Anyway, the case is not valid, so we should throw an error.
            if (user.IdentityId != null && user.IdentityId != _identityUser.Id)
            {
                throw new BadAssException(
                    message: "Your account data is invalid. Please, contact your system administrator",
                    innerException: new MismatchedIdentitiesException(user: user, identityUser: _identityUser));
            }

            return user;
        }
    }
}