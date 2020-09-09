using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PC.Database;
using PC.Database.Repositories.Users;
using PC.Models.Users;
using TestUtils.Mappings;
using Utils.Dates;
using Utils.Enums;
using Utils.Helpers;

namespace TestUtils.EntityFactories
{
    public class ApplicationUserFactory
    {
        private readonly ApplicationUser _instance;

        public ApplicationUserFactory(
            Role role,
            long userId = default(long),
            string firstName = "John",
            string lastName = "Smith",
            string email = "j.smith@petrel.ai")
        {
            _instance = new ApplicationUser
            {
                Role = role,
                Id = userId,
                Email = email,
                UserName = email,
                FirstName = firstName,
                LastName = lastName,
            };
        }

        public ApplicationUserFactory NotConfirmed()
        {
            _instance.EmailConfirmed = false;
            return this;
        }

        public ApplicationUserFactory Outdated()
        {
            _instance.DeletedAt = Date.Yesterday.EndOfTheDay();
            return this;
        }

        public ApplicationUser Build() => _instance;

        public async Task<ApplicationUser> BuildAsync(UserRepository repository)
        {
            repository.ThrowIfNull(nameof(repository));

            return await repository.GetByIdOrFailAsync(
                await repository.InsertAsync(Build()));
        }

        public async Task<ApplicationUser> BuildAsync(DatabaseContext context)
        {
            context.ThrowIfNull(nameof(context));

            return await BuildAsync(new UserRepository(context, AutomapperSingleton.Mapper));
        }

        public async Task<ApplicationUser> CreateConfirmedAsync(DatabaseContext context)
        {
            ApplicationUser user = await BuildAsync(context);

            var dbUser = await context.Users.FirstAsync(x => x.Id == user.Id);
            dbUser.EmailConfirmed = true;
            await context.SaveChangesAsync();

            user.EmailConfirmed = true;
            return user;
        }
    }
}