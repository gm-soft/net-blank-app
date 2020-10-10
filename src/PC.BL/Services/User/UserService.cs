using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PC.Database.Repositories.Users;
using PC.Models.Email;
using PC.Models.Users;
using PC.Services.Auth;
using PC.Services.Email;
using PC.Services.Email.Models;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Interfaces;
using Utils.Validators;

namespace PC.Services.User
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthorizationManager _authorizationManager;
        private readonly EmailDomainValidatorService _emailDomainValidatorService;
        private readonly IEmailSender _emailSender;
        private readonly IViewRenderer _viewRenderer;
        private readonly IBaseUrls _baseUrls;

        public UserService(
            IUserRepository userRepository,
            IAuthorizationManager authorizationManager,
            EmailDomainValidatorService emailDomainValidatorService,
            IEmailSender emailSender,
            IViewRenderer viewRenderer,
            IBaseUrls baseUrls)
        {
            _userRepository = userRepository;
            _authorizationManager = authorizationManager;
            _emailDomainValidatorService = emailDomainValidatorService;
            _emailSender = emailSender;
            _viewRenderer = viewRenderer;
            _baseUrls = baseUrls;
        }

        public async Task<int> ImportAsync(IReadOnlyCollection<ApplicationUser> users)
        {
            users.ThrowIfNull(nameof(users));

            if (!users.Any())
            {
                throw new BadRequestException("No users for import");
            }

            if (users.Count != users.GroupBy(x => x.Email).Count())
            {
                throw new BadRequestException("Collection of users for import contains duplications");
            }

            var usersToInsert = new List<ApplicationUser>();
            const Role defaultRole = Role.Employee;

            foreach (ApplicationUser user in users)
            {
                (string firstName, string lastName, string email) = ValidateAndCorrectUserData(user);

                if (await _userRepository.CheckHasUserWithEmailAsync(email))
                {
                    continue;
                }

                ApplicationUser applicationUserToInsert = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Role = defaultRole
                };

                usersToInsert.Add(applicationUserToInsert);
            }

            if (usersToInsert.Any())
            {
                await _userRepository.InsertAsync(usersToInsert);

                foreach (var user in usersToInsert)
                {
                    await SendInviteEmailAsync(user);
                }
            }

            return usersToInsert.Count;
        }

        private async Task CheckPermissionsForUpdateUserRoleAsync(ApplicationUser userToUpdate)
        {
            ApplicationUser currentUser = await _authorizationManager.GetCurrentUserAsync();

            if (!currentUser.HasRole(Role.HRManager))
            {
                throw new NoPermissionsException("You are not able to edit roles of other users");
            }

            Role roleFromDb = await _userRepository.GetUserRoleAsync(userToUpdate.Id);
            if (userToUpdate.Role == roleFromDb)
            {
                return;
            }

            if (currentUser.Id == userToUpdate.Id)
            {
                throw new BadRequestException("You cannot edit your own role");
            }

            if (currentUser.Role < roleFromDb)
            {
                throw new NoPermissionsException("You cannot edit roles of users with the role above your own");
            }

            if (currentUser.Role < userToUpdate.Role)
            {
                throw new BadRequestException("You cannot set the role above your own");
            }
        }

        private (string firstName, string lastName, string email) ValidateAndCorrectUserData(ApplicationUser user)
        {
            string email = user.Email?.Trim();
            string firstName = user.FirstName?.Trim();
            string lastName = user.LastName?.Trim();

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
            {
                throw new BadRequestException("Necessary fields are absent");
            }

            _emailDomainValidatorService.Validate(email);

            return (firstName, lastName, email);
        }

        public async Task<ApplicationUser> GetByIdAsync(long id)
        {
            ApplicationUser user = await _userRepository.GetByIdOrFailAsync(id);

            return user;
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();

            if (_authorizationManager.HasCurrentUserRole(Role.HRManager))
            {
                return users;
            }

            return users;
        }

        public async Task<long> InsertAsync(ApplicationUser user)
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.HRManager);

            user.ThrowIfNull(nameof(user));

            if (user == null)
            {
                throw new BadRequestException("No user for create");
            }

            const Role defaultRole = Role.Employee;

            (string firstName, string lastName, string email) = ValidateAndCorrectUserData(user);

            if (await _userRepository.CheckHasUserWithEmailAsync(email))
            {
                throw new InvalidOperationException("User is already exist");
            }

            var applicationUserToInsert = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Role = defaultRole
            };

            long userId = await _userRepository.InsertAsync(applicationUserToInsert);

            await SendInviteEmailAsync(applicationUserToInsert);

            return userId;
        }

        public async Task UpdateAsync(ApplicationUser data)
        {
            await CheckPermissionsForUpdateUserRoleAsync(data);

            data.ThrowIfInvalid();

            await _userRepository.UpdateAsync(data.Id, data);
        }

        public async Task DeleteAsync(long id)
        {
            _authorizationManager.HasCurrentUserRoleOrFail(Role.HRManager);

            ApplicationUser currentUser = await _authorizationManager.GetCurrentUserAsync();

            if (currentUser.Id == id)
            {
                throw new BadRequestException("You cannot delete your own account");
            }

            await _userRepository.DeleteAsync(id);
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> SearchAsync(string searchString)
        {
            searchString.ThrowIfNullOrEmpty(nameof(searchString));

            return await _userRepository.SearchAsync(searchString);
        }

        private async Task SendInviteEmailAsync(ApplicationUser user)
        {
            await _emailSender.SendSingleEmailAsync(
                await new UserInvitationEmail(
                        user: user,
                        urls: _baseUrls,
                        renderer: _viewRenderer)
                    .RenderAsync());
        }
    }
}