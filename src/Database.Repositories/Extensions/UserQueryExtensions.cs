using System.Linq;
using Microsoft.EntityFrameworkCore;
using PC.Models.Users;
using Utils.Helpers;

namespace Database.Repositories.Extensions
{
    public static class UserQueryExtensions
    {
        public static IQueryable<User> WithUsername(this IQueryable<User> query, string userName)
        {
            userName.ThrowIfNull(nameof(userName));
            var userNameUpper = userName.ToUpper();

            return query.Where(x => x.UserName.ToUpper() == userNameUpper);
        }

        public static IQueryable<User> IncludeRoles(this IQueryable<User> query)
        {
            return query
                .Include(x => x.Roles);
        }

        public static IQueryable<User> IncludeAllData(this IQueryable<User> query)
        {
            return query
                .IncludeRoles();
        }

        public static IQueryable<User> Active(this IQueryable<User> query)
        {
            return query.Where(x => x.DeletedAt == null);
        }

        public static IQueryable<User> EmailConfirmed(this IQueryable<User> query)
        {
            return query.Where(x => x.EmailConfirmed);
        }

        public static IQueryable<User> EmailNonConfirmed(this IQueryable<User> query)
        {
            return query.Where(x => !x.EmailConfirmed);
        }
    }
}