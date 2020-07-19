using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PC.Database.Models.Users;
using PC.Services.Claims;
using PC.Services.User;
using Utils.Authorization;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;

namespace Company.IdentityServer.Services.User
{
    public class UserIdentityService : IUserIdentityService
    {
        private readonly UserManager<DbUser> _userManager;
        private readonly EmailDomainValidatorService _emailDomainValidatorService;

        public UserIdentityService(UserManager<DbUser> userManager, EmailDomainValidatorService emailDomainValidatorService)
        {
            _userManager = userManager;
            _emailDomainValidatorService = emailDomainValidatorService;
        }

        // public is for test purposes.
        public async Task<DbUser> CreateUserAsync(ClaimsUser claimsUser)
        {
            _emailDomainValidatorService.Validate(claimsUser.Email);

            var user = new DbUser
            {
                UserName = claimsUser.Email,
                Email = claimsUser.Email,
                FirstName = claimsUser.FirstName,
                LastName = claimsUser.LastName,
                EmailConfirmed = true
            };

            IdentityResult createUserResult = await _userManager.CreateAsync(user);

            if (!createUserResult.Succeeded)
            {
                throw CreateException($"Cannot create new user '{claimsUser.Email}'\r\n", createUserResult);
            }

            string role = (await ChooseUserRoleAsync()).ToString();

            IdentityResult roleAddingResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleAddingResult.Succeeded)
            {
                throw CreateException($"Cannot add role '{role}' to user '{claimsUser.Email}'\r\n", roleAddingResult);
            }

            var claimsAddingResult = await _userManager.AddClaimsAsync(user, new List<Claim>
            {
                new Claim(CustomClaimTypes.Username, user.UserName),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            });

            if (!claimsAddingResult.Succeeded)
            {
                throw CreateException($"Cannot add claims to user '{claimsUser.Email}'\r\n", claimsAddingResult);
            }

            return user;
        }

        private BadRequestException CreateException(string messageSeed, IdentityResult identityResult)
        {
            foreach (IdentityError error in identityResult.Errors)
            {
                messageSeed += $"{error.Code}: {error.Description}\r\n";
            }

            throw new BadRequestException(messageSeed);
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

        public async Task<DbUser> UserByEmailOrCreateAsync(ClaimsUser claimsUser)
        {
            claimsUser.ThrowIfNull(nameof(claimsUser));

            DbUser dbUser =
                await FindByEmailInternalAsync(claimsUser.Email) ??
                await CreateUserAsync(claimsUser);

            return dbUser;
        }

        private async Task<DbUser> FindByEmailInternalAsync(string email)
        {
            _emailDomainValidatorService.Validate(email);

            var emailUpper = email.ToUpper();

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email.ToUpper() == emailUpper);

            if (user != null && user.EmailConfirmed == false)
            {
                user.EmailConfirmed = true;

                await _userManager.UpdateAsync(user);
            }

            return user;
        }
    }
}