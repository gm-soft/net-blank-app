using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Database.Repositories.Users;
using PC.Models.Users;
using Utils.Enums;
using Utils.Helpers;

namespace PC.Services.User
{
    public class UserServiceForIdentityServer : IUserServiceForIdentityServer
    {
        private readonly IUserRepository _userRepository;

        public UserServiceForIdentityServer(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Role> RoleOfUserAsync(long userId)
        {
            return await _userRepository.GetUserRoleAsync(userId);
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> UsersWithRoleAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<ApplicationUser> UserByEmailOrNullAsync(string email)
        {
            email.ThrowIfNull(nameof(email));

            return await _userRepository.GetByEmailOrNullAsync(email);
        }
    }
}