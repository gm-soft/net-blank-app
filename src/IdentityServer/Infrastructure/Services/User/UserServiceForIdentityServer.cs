using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Validators;

namespace IdentityServer.Infrastructure.Services.User
{
    public class UserServiceForIdentityServer : IUserServiceForIdentityServer
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UserServiceForIdentityServer> _logger;

        public UserServiceForIdentityServer(DatabaseContext context, ILogger<UserServiceForIdentityServer> logger)
        {
            context.ThrowIfNull(nameof(context));

            _context = context;
            _logger = logger;
        }

        public async Task<bool> HasEntityAsync(long id)
        {
            return await _context.Users.AnyAsync(x => x.Id == id);
        }

        public async Task<UserWithRole> UserOrFailAsync(long id)
        {
            return await _context
                .Users
                .ById(id)
                .AddRole(_context)
                .FirstOrDefaultAsync()
                ?? throw ResourceNotFoundException.CreateFromEntity<Database.Models.User>(id);
        }

        public async Task<Role> RoleOfUserAsync(long userId)
        {
            return await _context.RoleOfUserAsync(userId);
        }

        public async Task<IReadOnlyCollection<Database.Models.User>> UsersWithRoleAsync()
        {
            return (await _context.Users
                    .AddRole(_context)
                    .AsNoTracking()
                    .ToArrayAsync())
                .Select(x => x.Get())
                .ToArray();
        }

        public async Task<Database.Models.User> UserByUserNameOrNullAsync(string userName)
        {
            userName.ThrowIfNull(nameof(userName));

            return (await _context
                .Users
                .ByUserName(userName: userName)
                .AddRole(_context)
                .AsNoTracking()
                .FirstOrDefaultAsync())?
                .Get();
        }

        private async Task<Database.Models.User> ActiveUserByUserNameAsync(string userName)
        {
            userName.ThrowIfNull(nameof(userName));

            var user = await _context.Users
                .Active()
                .ByUserName(userName)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogInformation($"'User {userName} was not found'");
            }

            return user;
        }

        private async Task<Database.Models.User> InactiveUserByUserNameAsync(string userName)
        {
            userName.ThrowIfNull(nameof(userName));

            var user = await _context.Users
                .Where(x => x.DeletedAt != null)
                .ByUserName(userName)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogInformation($"'Inactive user {userName} was not found'");
            }

            return user;
        }

        public async Task UpdateAsync(Database.Models.User data)
        {
            data.ThrowIfNull(nameof(data));

            data.ThrowIfInvalid();

            Database.Models.User user = await ActiveUserByUserNameAsync(data.UserName);

            if (user != null)
            {
                user.Update(
                    firstName: data.FirstName,
                    lastName: data.LastName);

                var userRole = _context.UserRoles.Where(x => x.UserId == user.Id);

                if (user.Role != data.Role)
                {
                    _context.UserRoles.RemoveRange(userRole);

                    await _context.UserRoles.AddAsync(new IdentityUserRole<long>()
                    {
                        UserId = data.Id,
                        RoleId = (long)data.Role
                    });
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(string userName)
        {
            Database.Models.User user = await ActiveUserByUserNameAsync(userName);

            if (user != null)
            {
                user.DeletedAt = DateTimeOffset.Now;

                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveAsync(string userName)
        {
            Database.Models.User user = await InactiveUserByUserNameAsync(userName);
            if (user != null)
            {
                _context.Remove(user);

                await _context.SaveChangesAsync();
            }
        }
    }
}