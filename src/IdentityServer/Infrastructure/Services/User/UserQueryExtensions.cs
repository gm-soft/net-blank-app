using System.Linq;
using System.Threading.Tasks;
using IdentityServer.Database.Models;
using Microsoft.EntityFrameworkCore;
using Utils.Enums;

namespace IdentityServer.Infrastructure.Services.User
{
    internal static class UserQueryExtensions
    {
        public static Task<Role> RoleOfUserAsync(this DatabaseContext context, long userId)
        {
            IQueryable<Role> roleQuery = from identityUserRole in context.UserRoles
                                         join identityRole in context.Roles on identityUserRole.RoleId equals identityRole.Id
                                         where identityUserRole.UserId == userId
                                         select identityRole.Role;

            return roleQuery.FirstAsync();
        }

        public static IQueryable<Database.Models.User> ById(this IQueryable<Database.Models.User> query, long id)
        {
            return query.Where(x => x.Id == id);
        }

        public static IQueryable<Database.Models.User> ByUserName(this IQueryable<Database.Models.User> query, string userName = null)
        {
            userName = userName.ToUpper();
            return query.Where(x => x.UserName.ToUpper() == userName);
        }

        public static IQueryable<Database.Models.User> Active(this IQueryable<Database.Models.User> query)
        {
            return query.Where(x => x.DeletedAt == null);
        }

        public static IQueryable<UserWithRole> AddRole(this IQueryable<Database.Models.User> query, DatabaseContext context)
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
    }
}