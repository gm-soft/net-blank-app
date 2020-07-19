using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PC.Database.Models.Users;
using PC.Database.Repositories.Base;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using Utils.Dates;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Validators;

namespace PC.Database.Repositories.Users
{
    public class UserRepository : Repository<DbUser, ApplicationUser>, IUserRepository
    {
        public override async Task UpdateAsync(long id, ApplicationUser data)
        {
            data.ThrowIfNull(nameof(data));
            data.ThrowIfInvalid();

            UserWithRole user = await GetByIdWithRoleOrFailInternalAsync(id);

            user.User.FirstName = data.FirstName;
            user.User.LastName = data.LastName;
            user.User.PhoneNumber = data.PhoneNumber;

            if (user.Role != data.Role)
            {
                await ChangeRoleWithoutSaveAsync(id, data.Role);
            }

            await Context.SaveChangesAsync();
        }

        /// <summary>
        /// This method is necessary to change the role for user within an update operation.
        /// If we leave saving changes, we will get a possible database error without rollbacks.
        /// </summary>
        /// <param name="userId">User id.</param>
        /// <param name="role">Role to assign to the user.</param>
        /// <returns>Task.</returns>
        private async Task ChangeRoleWithoutSaveAsync(long userId, Role role)
        {
            var roleAsId = (long)role;

            if (!await Context.Roles.AnyAsync(x => x.Id == roleAsId))
            {
                throw ResourceNotFoundException.CreateFromEntity<DbIdentityRole>(roleAsId);
            }

            IdentityUserRole<long> userRole = await Context.UserRoles
                                                  .FirstOrDefaultAsync(x => x.UserId == userId)
                                              ?? throw new ResourceNotFoundException($"Cannot find IdentityUserRole for User Id:{userId}");

            Context.UserRoles.Remove(userRole);
            await Context.UserRoles.AddAsync(new IdentityUserRole<long>
            {
                UserId = userId,
                RoleId = roleAsId
            });
        }

        public async Task<ApplicationUser> FirstUserWithRoleOrNullAsync(Role role)
        {
            UserWithRole userOrNull = await (from user in GetAllUsersWithRoles()
                where user.Role == role
                select user)
                .FirstOrDefaultAsync();

            return Mapper.Map<ApplicationUser>(userOrNull);
        }

        public override async Task<ApplicationUser> GetByIdOrFailAsync(long id)
        {
            UserWithRole user = await GetByIdWithRoleOrFailInternalAsync(id);
            return Mapper.Map<ApplicationUser>(user);
        }

        public async Task<ApplicationUser> GetByEmailOrNullAsync(string email)
        {
            email.ThrowIfNull(nameof(email));

            var user = await GetAllUsersWithRoles(email: email).FirstOrDefaultAsync();

            return Mapper.Map<ApplicationUser>(user);
        }

        private IQueryable<UserWithRole> GetAllUsersWithRoles(
            long? id = null, long? functionalManagerId = null, string email = null)
        {
            return GetAllInternal()
                .SearchBy(id, functionalManagerId, email)
                .AttachRoles(Context);
        }

        private async Task<UserWithRole> GetByIdWithRoleOrFailInternalAsync(long id)
        {
            return await GetAllUsersWithRoles(id).FirstOrDefaultAsync()
                   ?? throw ResourceNotFoundException.CreateFromEntity<ApplicationUser>(id);
        }

        public virtual async Task<bool> CheckHasUserWithEmailAsync(string email)
        {
            email.ThrowIfNull(nameof(email));

            var emailUpper = email.ToUpper();

            return await Context.Users.AnyAsync(x => x.Email.ToUpper() == emailUpper);
        }

        public async Task<Role> GetUserRoleAsync(long userId)
        {
            IQueryable<Role> roleQuery = from identityUserRole in Context.UserRoles
                                         join identityRole in Context.Roles on identityUserRole.RoleId equals identityRole.Id
                                         where identityUserRole.UserId == userId
                                         select identityRole.Role;

            return await roleQuery.FirstAsync();
        }

        /// <summary>
        /// We have to use transaction here, because we cannot create a new instance of IdentityUserRole without User Id.
        /// When we insert new users, we have no their ids, so we have to save changes after every insertion.
        /// To make the insertion consistent, we use transaction here.
        /// </summary>
        /// <param name="users">A collection of users to save.</param>
        /// <returns>Task.</returns>
        public async Task InsertAsync(IReadOnlyCollection<ApplicationUser> users)
        {
            await DoWithinTransactionAsync(
                action: async () =>
                {
                    foreach (ApplicationUser user in users)
                    {
                        await AddUserAndRoleAsync(TransformForInsertion(user), user.Role);
                    }
                },
                errorMessage: "Cannot import users due to database error");
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> InactiveUsersAsync()
        {
            UserWithRole[] users = await base.GetAllInternal()
                .Where(x => x.DeletedAt != null)
                .IncludeAllData()
                .AttachRoles(Context)
                .ToArrayAsync();

            return Mapper.Map<IReadOnlyCollection<ApplicationUser>>(users);
        }

        private async Task<DbUser> AddUserAndRoleAsync(DbUser dbUser, Role role)
        {
            EntityEntry<DbUser> userEntry = await Context.Users.AddAsync(dbUser);
            await Context.SaveChangesAsync();
            await Context.UserRoles.AddAsync(new IdentityUserRole<long>
            {
                RoleId = (long)role,
                UserId = userEntry.Entity.Id
            });
            await Context.SaveChangesAsync();

            return userEntry.Entity;
        }

        public override async Task<long> InsertAsync(ApplicationUser user)
        {
            DbUser dbUser = TransformForInsertion(user);
            await DoWithinTransactionAsync(
                action: async () =>
                {
                    dbUser = await AddUserAndRoleAsync(dbUser, user.Role);
                },
                errorMessage: "Cannot import user due to database error");

            return dbUser.Id;
        }

        protected override IQueryable<DbUser> GetAllInternal()
        {
            return ActiveUsersSet().IncludeAllData();
        }

        private IQueryable<DbUser> ActiveUsersSet()
        {
            return base.GetAllInternal().Where(x => x.DeletedAt == null);
        }

        public override async Task<IReadOnlyCollection<ApplicationUser>> GetAllAsync()
        {
            return Mapper.Map<IReadOnlyCollection<ApplicationUser>>(await ActiveUsersSet()
                .OrderBy(x => x.Id)
                .AttachRoles(Context)
                .ToArrayAsync());
        }

        protected override DbUser TransformForInsertion(ApplicationUser entity)
        {
            var user = new DbUser
            {
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                UserName = entity.UserName,
                PhoneNumber = entity.PhoneNumber
            };

            return user;
        }

        protected override void UpdateInternal(ApplicationUser data, DbUser entity)
        {
            throw new NotSupportedException();
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> SearchAsync(string searchString)
        {
            searchString.ThrowIfNullOrEmpty(nameof(searchString));

            DbUser[] users = await ActiveUsersSet()
                .Where(s => s.LastName.Contains(searchString) ||
                            s.FirstName.Contains(searchString) ||
                            s.Email.Contains(searchString) ||
                            s.UserName.Contains(searchString))
                .AsNoTracking()
                .ToArrayAsync();

            return Mapper.Map<ApplicationUser[]>(users);
        }

        public override async Task DeleteAsync(long id)
        {
            DbUser entity = await GetByIdOrFailInternalAsync(id);
            entity.DeletedAt = DateTimeOffset.Now;

            await Context.SaveChangesAsync();
        }

        public UserRepository(DatabaseContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
    }
}