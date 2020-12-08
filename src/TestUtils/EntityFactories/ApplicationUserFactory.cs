using System.Threading.Tasks;
using Database;
using Database.Repositories.Users;
using Microsoft.EntityFrameworkCore;
using PC.Database;
using PC.Models.Users;
using Utils.Dates;
using Utils.Enums;
using Utils.Helpers;

namespace TestUtils.EntityFactories
{
    public class ApplicationUserFactory
    {
        private readonly User _instance;

        public ApplicationUserFactory(Role role, string email)
            : this(new FakeUser(role, email))
        {
        }

        public ApplicationUserFactory(Role role)
            : this(new FakeUser(role))
        {
        }

        public ApplicationUserFactory(FakeUser instance)
            : this(instance.Please())
        {
        }

        private ApplicationUserFactory(User instance)
        {
            _instance = instance;
        }

        public ApplicationUserFactory NotConfirmed()
        {
            _instance.EmailConfirmed = false;
            return this;
        }

        public async Task<User> OutdatedAsync(DatabaseContext context)
        {
            User user = await BuildAsync(context);

            var dbUser = await context.Users.FirstAsync(x => x.Id == user.Id);
            user.DeletedAt = dbUser.DeletedAt = Date.Yesterday.EndOfTheDay();
            await context.SaveChangesAsync();

            return user;
        }

        public ApplicationUserFactory IdentityId(long identityId)
        {
            _instance.IdentityId = identityId;
            return this;
        }

        public User Build() => _instance;

        public async Task<User> BuildAsync(UserRepository repository)
        {
            repository.ThrowIfNull(nameof(repository));

            var user = Build();
            user.Id = default(long);

            return await repository.GetByIdOrFailAsync(
                await repository.InsertAsync(user));
        }

        public async Task<User> BuildAsync(DatabaseContext context)
        {
            context.ThrowIfNull(nameof(context));

            return await BuildAsync(new UserRepository(context));
        }

        public async Task<User> CreateConfirmedAsync(DatabaseContext context)
        {
            var repo = new UserRepository(context);
            User user = await BuildAsync(repo);

            return await repo.ConfirmAsync(user);
        }
    }
}