using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PC.Database;
using PC.Database.Repositories.Base;
using PC.Models.Records.Users;
using PC.Models.Users;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Pagination;
using Utils.Validators;

namespace Database.Repositories.Users
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DatabaseContext context)
            : base(context)
        {
            context.ThrowIfNull(nameof(context));
        }

        public override async Task UpdateAsync(User data)
        {
            data.ThrowIfNull(nameof(data));
            data.ThrowIfInvalid();

            User user = await Context
                            .Users
                            .IncludeRoles()
                            .ByIdOrNullAsync(data.Id)
                ?? throw ResourceNotFoundException.CreateFromEntity<User>(data.Id);

            user.Update(
                firstName: data.FirstName,
                lastName: data.LastName,
                phone: data.PhoneNumber,
                role: data.Role);

            await Context.SaveChangesAsync();
        }

        public async Task<User> FirstUserWithRoleOrNullAsync(Role role)
        {
            var roleAsLong = (long)role;
            return await Context
                .UserRoles
                .Include(x => x.User)
                .Include(x => x.Role)
                .Where(x => x.RoleId == roleAsLong)
                .Select(x => x.User)
                .OrderBy(x => x.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public override async Task<User> GetByIdOrFailAsync(long id)
        {
            return await GetAllInternal()
                       .AsNoTracking()
                       .ByIdOrNullAsync(id)
                   ?? throw ResourceNotFoundException.CreateFromEntity<User>(id);
        }

        public async Task<User> GetByIdIncludingInactiveAsync(long userId)
        {
            return await Context.Users
                       .IncludeAllData()
                       .AsNoTracking()
                       .ByIdOrNullAsync(userId)
                   ?? throw ResourceNotFoundException.CreateFromEntity<User>(userId);
        }

        public async Task<User> GetByUsernameOrNullAsync(IdentityUser data)
        {
            data.ThrowIfNull(nameof(data));

            var user = await Context.Users
                .IncludeAllData()
                .WithUsername(data.UserName)
                .FirstOrDefaultAsync();

            if (user != null)
            {
                var save = false;
                if (!user.EmailConfirmed && data.EmailConfirmed)
                {
                    user.EmailConfirmed = true;
                    save = true;
                }

                if (user.IdentityId == null)
                {
                    user.IdentityId = data.Id;
                    save = true;
                }

                if (save)
                {
                    await Context.SaveChangesAsync();
                }
            }

            return user;
        }

        public async Task<User> CreateUserAsync(IdentityUser data)
        {
            var entry = await Context.Users.AddAsync(data.Create());
            await Context.SaveChangesAsync();

            return await GetByIdOrFailAsync(entry.Entity.Id);
        }

        public virtual async Task<bool> CheckHasUserWithUsernameAsync(string userName)
        {
            return await Context.Users.WithUsername(userName).AnyAsync();
        }

        public async Task InsertAsync(IReadOnlyCollection<User> users)
        {
            try
            {
                foreach (User user in users)
                {
                    await Context.Users.AddAsync(user);
                }

                await Context.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                throw new InvalidOperationException("Cannot import users due to database error", exception);
            }
        }

        public async Task<IReadOnlyCollection<User>> InactiveUsersAsync()
        {
            return await base.GetAllInternal()
                .Where(x => x.DeletedAt != null)
                .IncludeAllData()
                .AsNoTracking()
                .ToArrayAsync();
        }

        public override async Task<long> InsertAsync(User user)
        {
            EntityEntry<User> userEntry = await Context.Users.AddAsync(user);
            await Context.SaveChangesAsync();

            return userEntry.Entity.Id;
        }

        protected override IQueryable<User> GetAllInternal()
        {
            return base.GetAllInternal()
                .Active()
                .IncludeAllData();
        }

        public override async Task<IReadOnlyCollection<User>> GetAllAsync()
        {
            return await Context.Users
                .IncludeRoles()
                .Active()
                .OrderBy(x => x.Id)
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<PaginatedList<User>> SearchAsync(string searchString, PageModel pageModel)
        {
            searchString.ThrowIfNullOrEmpty(nameof(searchString));

            return await Context.Users
                .IncludeRoles()
                .Active()
                .EmailConfirmed()
                .Where(s => s.LastName.Contains(searchString) || s.FirstName.Contains(searchString)
                                                              || s.Email.Contains(searchString) || s.UserName.Contains(searchString))
                .OrderBy(x => x.Id)
                .AsPaginatedAsync(pageModel);
        }

        public override async Task DeleteAsync(long id)
        {
            User entity = await GetByIdOrFailInternalAsync(id);

            entity.DeletedAt = DateTimeOffset.Now;

            await Context.SaveChangesAsync();
        }

        public async Task<PaginatedList<User>> GetAllAsync(PageModel pageModel)
        {
            return await Context.Users
                .IncludeRoles()
                .Active()
                .OrderBy(x => x.Id)
                .AsPaginatedAsync(pageModel);
        }

        public async Task<PaginatedList<User>> InactiveUsersAsync(PageModel pageModel)
        {
            return await Context.Users
                    .Where(x => x.DeletedAt != null)
                    .OrderBy(x => x.Id)
                    .AsPaginatedAsync(pageModel);
        }

        public async Task<IReadOnlyCollection<string>> ActiveUsersEmailsAsync()
        {
            return await Context.Users
                .IncludeRoles()
                .Active()
                .Select(x => x.Email)
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task RemoveInactiveUserFromDatabaseAsync(long id)
        {
            User entity = await Context.Users
                    .FirstOrDefaultAsync(x => x.DeletedAt != null && x.Id == id)
                   ?? throw ResourceNotFoundException.CreateFromEntity<User>(id);

            Context.Remove(entity);

            await Context.SaveChangesAsync();
        }

        public async Task<IReadOnlyCollection<User>> GetNonConfirmedUsersAsync()
        {
            return await Context.Users
                .Active()
                .IncludeRoles()
                .EmailNonConfirmed()
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<int> RemoveNonConfirmedUsersFromDatabaseAsync()
        {
            User[] users = await Context.Users
                .EmailNonConfirmed()
                .ToArrayAsync();

            foreach (var user in users)
            {
                Context.Remove(user);
            }

            await Context.SaveChangesAsync();
            return users.Length;
        }

        public async Task<User> ConfirmAsync(User data)
        {
            data.ThrowIfNull(nameof(data));

            User user = await Context.Users.ByIdOrNullAsync(data.Id)
                ?? throw ResourceNotFoundException.CreateFromEntity<User>(data.Id);

            if (user.EmailConfirmed)
            {
                throw new InvalidOperationException($"The user #{user.Id} is confirmed");
            }

            user.EmailConfirmed = true;
            await Context.SaveChangesAsync();

            return await GetByIdOrFailAsync(data.Id);
        }
    }
}