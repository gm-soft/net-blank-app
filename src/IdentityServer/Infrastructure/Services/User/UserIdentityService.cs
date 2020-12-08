using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Validators;

namespace IdentityServer.Infrastructure.Services.User
{
    public class UserIdentityService : IUserIdentityService
    {
        private readonly UserManager<Database.Models.User> _userManager;
        private readonly EmailDomainValidatorService _emailDomainValidatorService;

        public UserIdentityService(UserManager<Database.Models.User> userManager, EmailDomainValidatorService emailDomainValidatorService)
        {
            _userManager = userManager;
            _emailDomainValidatorService = emailDomainValidatorService;
        }

        // public is for test purposes.
        public async Task<Database.Models.User> CreateUserAsync(GoogleClaims claimsUser)
        {
            _emailDomainValidatorService.Validate(claimsUser.Email);

            Role userRole = await ChooseUserRoleAsync();

            var user = new Database.Models.User(
                firstName: claimsUser.GivenName,
                lastName: claimsUser.Surname,
                email: claimsUser.Email,
                role: userRole,
                emailConfirmed: true);

            claimsUser = claimsUser.ReadUser(user);

            IdentityResult createUserResult = await _userManager.CreateAsync(user);

            if (!createUserResult.Succeeded)
            {
                throw CreateException($"Cannot create new user '{claimsUser.Email}'\r\n", createUserResult);
            }

            string role = userRole.ToString();

            IdentityResult roleAddingResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleAddingResult.Succeeded)
            {
                throw CreateException($"Cannot add role '{role}' to user '{claimsUser.Email}'\r\n", roleAddingResult);
            }

            IdentityResult claimsAddingResult = await _userManager.AddClaimsAsync(user, claimsUser);

            if (!claimsAddingResult.Succeeded)
            {
                throw CreateException($"Cannot add claims to user '{claimsUser.Email}'\r\n", claimsAddingResult);
            }

            return user;
        }

        private BadAssException CreateException(string messageSeed, IdentityResult identityResult)
        {
            foreach (IdentityError error in identityResult.Errors)
            {
                messageSeed += $"{error.Code}: {error.Description}\r\n";
            }

            throw new BadAssException(messageSeed);
        }

        private async Task<Role> ChooseUserRoleAsync()
        {
            return await HasAnyUserAsync()
                ? Role.Employee
                : Role.SystemAdministrator;
        }

        /// <summary>
        /// This method should not be removed because of test purposes.
        /// There is no way to mock '.Users.AnyAsync();' in unittests, so we have to override this method.
        /// </summary>
        /// <returns>True, if there is any other user.</returns>
        protected virtual async Task<bool> HasAnyUserAsync()
        {
            // The first created user already exists in database.
            return await _userManager.Users.CountAsync() > 1;
        }

        public async Task<Database.Models.User> UserByEmailOrCreateAsync(GoogleClaims claimsUser)
        {
            claimsUser.ThrowIfNull(nameof(claimsUser));

            Database.Models.User user =
                await ByEmailOrNullAsync(claimsUser.Email) ??
                await CreateUserAsync(claimsUser);

            return user;
        }

        private async Task<Database.Models.User> ByEmailOrNullAsync(string email)
        {
            _emailDomainValidatorService.Validate(email);

            var emailUpper = email.ToUpper();

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email.ToUpper() == emailUpper);

            if (user != null && user.EmailConfirmed == false)
            {
                user.EmailConfirmed = true;

                // It 's necessary to update security stamp, otherwise we get an exception
                await _userManager.UpdateSecurityStampAsync(user);
                await _userManager.UpdateAsync(user);
            }

            return user;
        }
    }
}