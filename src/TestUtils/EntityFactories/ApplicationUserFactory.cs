using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Database;
using PC.Database.Repositories.Users;
using PC.Models.Users;
using TestUtils.Mappings;
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
            string email = "j.smith@gmail.com")
        {
            _instance = new ApplicationUser
            {
                Role = role,
                Id = userId,
                Email = email,
                UserName = email,
                FirstName = firstName,
                LastName = lastName
            };
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

            var repository = new UserRepository(context, AutomapperSingleton.Mapper);

            return await repository.GetByIdOrFailAsync(
                await repository.InsertAsync(Build()));
        }
    }
}