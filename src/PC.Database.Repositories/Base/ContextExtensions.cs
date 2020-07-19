using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PC.Database.Models.BaseModels;

namespace PC.Database.Repositories.Base
{
    public static class ContextExtensions
    {
        public static Task<T> ByIdOrNullAsync<T>(this IQueryable<T> query, long id)
            where T : DbBaseModel
        {
            return query.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}