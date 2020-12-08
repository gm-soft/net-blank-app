using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database.Repositories.Users;
using Domain.Dtos.Users;
using Domain.Services.Auth;
using Domain.Services.Users.Email;
using Domain.Services.Users.MessageBrokers;
using PC.Models.Users;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Pagination;
using Utils.Validators;

namespace Domain.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthorizationManager _authorizationManager;
        private readonly EmailDomainValidatorService _emailDomainValidatorService;
        private readonly IUserEmail _emailSender;
        private readonly IUserEvent _userEvent;

        public UserService(
            IUserRepository userRepository,
            IAuthorizationManager authorizationManager,
            EmailDomainValidatorService emailDomainValidatorService,
            IUserEmail emailSender,
            IUserEvent userEvent)
        {
            _userRepository = userRepository;
            _authorizationManager = authorizationManager;
            _emailDomainValidatorService = emailDomainValidatorService;
            _emailSender = emailSender;
            _userEvent = userEvent;
        }

        public async Task<User> GetByIdIncludingInactiveAsync(long userId)
        {
            User currentUser = await _authorizationManager.GetCurrentUserAsync();

            if (!currentUser.HasRole(Role.HRManager))
            {
                throw new NoPermissionsException("You have no permission to execute this operation");
            }

            return await _userRepository.GetByIdIncludingInactiveAsync(userId);
        }

        public async Task<int> ImportAsync(IReadOnlyCollection<UserDto> users)
        {
            users.ThrowIfNullOrEmpty(nameof(users));

            if (users.Count != users.GroupBy(x => x.UserName).Count())
            {
                throw new BadAssException("Collection of users for import contains duplications");
            }

            var usersToInsert = new List<User>();
            const Role defaultRole = Role.Employee;

            foreach (UserDto user in users)
            {
                user.PurifyData();
                _emailDomainValidatorService.Validate(user.UserName);

                if (await _userRepository.CheckHasUserWithUsernameAsync(user.UserName))
                {
                    continue;
                }

                var applicationUserToInsert = new User(
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    userName: user.UserName,
                    role: defaultRole,
                    emailConfirmed: false);

                usersToInsert.Add(applicationUserToInsert);
            }

            if (usersToInsert.Any())
            {
                await _userRepository.InsertAsync(usersToInsert);
            }

            return usersToInsert.Count;
        }

        public async Task<User> GetByIdAsync(long id)
        {
            return await _userRepository.GetByIdOrFailAsync(id);
        }

        public async Task<IReadOnlyCollection<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<long> InsertAsync(UserDto data)
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.HRManager);

            data.ThrowIfNull(nameof(data));

            const Role defaultRole = Role.Employee;

            data.PurifyData();
            _emailDomainValidatorService.Validate(data.UserName);

            if (await _userRepository.CheckHasUserWithUsernameAsync(data.UserName))
            {
                throw new InvalidOperationException("User is already exist");
            }

            var applicationUserToInsert = new User(
                firstName: data.FirstName,
                lastName: data.LastName,
                userName: data.UserName,
                role: defaultRole,
                emailConfirmed: false);

            long userId = await _userRepository.InsertAsync(applicationUserToInsert);

            // TODO Maxim: load created user from DB here
            await _userEvent.CreateAsync(applicationUserToInsert);

            return userId;
        }

        public async Task UpdateAsync(UserDto data)
        {
            data.ThrowIfNull(nameof(data));

            User currentUser = await _authorizationManager.GetCurrentUserAsync();
            User user = await _userRepository.GetByIdOrFailAsync(data.Id);

            user.CouldBeUpdatedOrFail(currentUser, data.Role);

            user.Update(
                firstName: data.FirstName,
                lastName: data.LastName,
                phone: data.PhoneNumber,
                role: data.Role);

            user.ThrowIfInvalid();

            await _userRepository.UpdateAsync(user);

            await _userEvent.UpdateAsync(user);
        }

        public async Task DeleteAsync(long id)
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.HRManager);

            User currentUser = await _authorizationManager.GetCurrentUserAsync();

            if (currentUser.Id == id)
            {
                throw new BadAssException("You cannot delete your own account");
            }

            User user = await _userRepository.GetByIdIncludingInactiveAsync(id);

            if (user.DeletedAt != null)
            {
                throw new BadAssException($"The user has been deleted already");
            }

            await _userRepository.DeleteAsync(id);

            await _userEvent.DeleteAsync(user.UserName);
        }

        public async Task<PaginatedList<User>> SearchAsync(string searchString, PageModel pageModel)
        {
            searchString.ThrowIfNullOrEmpty(nameof(searchString));

            return await _userRepository.SearchAsync(searchString, pageModel);
        }

        /// <summary>
        /// Sends invitation emails as a bulk operation to all not-confirmed users.
        /// </summary>
        /// <returns>Count of emails.</returns>
        public async Task<int> SendInviteEmailsAsync()
        {
            User currentUser = await _authorizationManager.GetCurrentUserAsync();

            currentUser.HasRoleOrFail(Role.SystemAdministrator);

            IReadOnlyCollection<User> users = await _userRepository.GetNonConfirmedUsersAsync();

            foreach (var user in users)
            {
                await _emailSender.SendInviteEmailAsync(user: user, currentUser: currentUser);
            }

            return users.Count;
        }

        public async Task<int> SendCompanyWideInviteEmailAsync()
        {
            User currentUser = await _authorizationManager.GetCurrentUserAsync();

            currentUser.HasRoleOrFail(Role.SystemAdministrator);

            IReadOnlyCollection<string> emails = await _userRepository.ActiveUsersEmailsAsync();

            await _emailSender.SendCompanyWideInviteEmailAsync(emails, currentUser);

            const int constantCountOfEmails = 1;
            return constantCountOfEmails;
        }

        public async Task ResendInviteEmailAsync(long userId)
        {
            User currentUser = await _authorizationManager.GetCurrentUserAsync();
            currentUser.HasRoleOrFail(Role.HRManager);

            User user = await _userRepository.SimpleOrFailAsync(userId);

            if (user.EmailConfirmed)
            {
                throw new BadAssException("User email is already confirmed.");
            }

            await _emailSender.SendInviteEmailAsync(user, currentUser);
        }

        public async Task<PaginatedList<User>> GetAllAsync(PageModel pageModel)
        {
            return await _userRepository.GetAllAsync(pageModel);
        }

        public async Task<PaginatedList<User>> InactiveUsersAsync(PageModel pageModel)
        {
            return await _userRepository.InactiveUsersAsync(pageModel);
        }

        public async Task RemoveUserFromDatabaseAsync(long id)
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.SystemAdministrator);

            User currentUser = await _authorizationManager.GetCurrentUserAsync();

            User user = await _userRepository.GetByIdIncludingInactiveAsync(id);

            if (user.DeletedAt == null)
            {
                throw new BadAssException($"The user is active. Please, make user outdated first.");
            }

            if (currentUser.Id == id)
            {
                throw new BadAssException("You cannot remove your own account from database");
            }

            await _userRepository.RemoveInactiveUserFromDatabaseAsync(id);

            await _userEvent.RemoveAsync(user.UserName);
        }

        public async Task<int> RemoveNonConfirmedUsersFromDatabaseAsync()
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.SystemAdministrator);

            return await _userRepository.RemoveNonConfirmedUsersFromDatabaseAsync();
        }
    }
}