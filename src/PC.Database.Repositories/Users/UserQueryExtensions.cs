using System.Linq;
using Microsoft.EntityFrameworkCore;
using PC.Database.Models.Users;
using PC.Database.Repositories.Dto;

namespace PC.Database.Repositories.Users
{
    public static class UserQueryExtensions
    {
        public static IQueryable<DbUser> SearchBy(
            this IQueryable<DbUser> query,
            long? id = null,
            long? functionalManagerId = null,
            string email = null)
        {
            if (id.HasValue)
            {
                query = query.Where(x => x.Id == id.Value);
            }
            else if (email != null)
            {
                email = email.ToUpper();
                query = query.Where(x => x.Email.ToUpper() == email);
            }

            return query;
        }

        public static IQueryable<UserWithRole> AttachRoles(this IQueryable<DbUser> query, DatabaseContext context)
        {
            return from user in query
                join identityUserRole in context.UserRoles on user.Id equals identityUserRole.UserId
                join identityRole in context.Roles on identityUserRole.RoleId equals identityRole.Id
                select new UserWithRole
                {
                    User = user,
                    Role = identityRole.Role
                };
        }

        public static IQueryable<DbUser> IncludeAllData(this IQueryable<DbUser> query)
        {
            return query;
        }
    }
}