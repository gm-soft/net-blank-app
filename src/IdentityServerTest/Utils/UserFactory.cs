using System;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer;
using IdentityServer.Database.Models;
using IdentityServer.Infrastructure.Services.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using Moq;
using Utils.Dates;
using Utils.Enums;
using Utils.Helpers;

namespace IdentityServerTest.Utils
{
    public class UserFactory
    {
        private readonly User _instance;

        public UserFactory(
            Role role,
            string email = null,
            string firstName = null,
            string lastName = null)
        {
            _instance = new User
            {
                Id = new Random((int)DateTimeOffset.Now.Ticks).Next(0, int.MaxValue),
                FirstName = firstName ?? Faker.Name.First(),
                LastName = lastName ?? Faker.Name.Last()
            };

            email = email ?? $"{_instance.FirstName.First()}.{_instance.LastName}@example.com".ToLowerInvariant() + DateTimeOffset.Now.Ticks;

            _instance.UserName = email;
            _instance.Email = email;
            _instance.Role = role;
        }

        public UserFactory NotConfirmed()
        {
            _instance.EmailConfirmed = false;
            return this;
        }

        public UserFactory Confirmed()
        {
            _instance.EmailConfirmed = true;
            return this;
        }

        public UserFactory Outdated()
        {
            _instance.DeletedAt = Date.Yesterday.EndOfTheDay();
            return this;
        }

        public User Build() => _instance;

        public async Task<User> PleaseAsync(DatabaseContext context)
        {
            context.ThrowIfNull(nameof(context));

            _instance.Id = default(long);

            using (IDbContextTransaction t = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var entry = await context.Users.AddAsync(_instance);
                    await context.SaveChangesAsync();

                    await context.UserRoles.AddAsync(new IdentityUserRole<long>()
                    {
                        UserId = entry.Entity.Id,
                        RoleId = (long)_instance.Role
                    });

                    await context.SaveChangesAsync();
                    _instance.Id = entry.Entity.Id;
                    await t.CommitAsync();
                }
                catch (Exception)
                {
                    await t.RollbackAsync();
                    throw;
                }
            }

            var user = await new UserServiceForIdentityServer(context, new Mock<ILogger<UserServiceForIdentityServer>>().Object)
                .UserOrFailAsync(_instance.Id);

            return user.Get();
        }
    }
}