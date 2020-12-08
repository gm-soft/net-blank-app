using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PC.Models.Users;
using Utils.Interfaces;

namespace Database.Repositories.Extensions
{
    public static class ContextExtensions
    {
        public static Task<T> ByIdOrNullAsync<T>(this IQueryable<T> query, long id)
            where T : class, IBaseModel
        {
            return query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public static Task<User> ByIdOrNullAsync(this IQueryable<User> query, long id)
        {
            return query.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}