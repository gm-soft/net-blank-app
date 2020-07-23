using System;
using System.Threading.Tasks;
using AutoMapper;
using PC.Database.Repositories.Users;
using PC.Models.Users;
using PC.Services.Claims;
using Utils.Enums;
using Utils.Exceptions;

namespace PC.Services.Auth
{
    public class AuthorizationManager : IAuthorizationManager
    {
        private readonly ClaimsUser _claimsUser;
        private readonly IUserRepository _userRepository;
        private readonly bool _executionWithinBackgroundTask;

        private ApplicationUser _applicationUser;

        public AuthorizationManager(
            IUserClaimsProvider claimsProvider, IUserRepository userRepository)
        {
            _userRepository = userRepository;

            if (claimsProvider.WithinWebRequest())
            {
                _executionWithinBackgroundTask = false;
                _claimsUser = new ClaimsUser(claimsProvider.GetUserClaims());
            }
            else
            {
                _executionWithinBackgroundTask = true;
            }
        }

        public async Task<ApplicationUser> GetCurrentUserAsync()
        {
            if (_applicationUser == null)
            {
                if (_executionWithinBackgroundTask)
                {
                    throw new InvalidOperationException("The current user is not available within background class");
                }

                _applicationUser = await _userRepository.GetByEmailOrFailAsync(_claimsUser.Email);
                _applicationUser.Role = _claimsUser.Role;
            }

            return _applicationUser;
        }

        public bool HasCurrentUserRole(Role role) => CurrentUserRoleFromClaims() >= role;

        public void HasCurrentUserRoleOrFail(Role role, string message = null)
        {
            if (!HasCurrentUserRole(role))
            {
                message = message ?? "Current user has no permission to do this operation";
                throw new NoPermissionsException(message);
            }
        }

        private Role CurrentUserRoleFromClaims()
        {
            if (_executionWithinBackgroundTask)
            {
                return Role.System;
            }

            return _claimsUser.Role;
        }
    }
}