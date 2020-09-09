using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Utils.Pagination
{
    public static class QueryExtensions
    {
        public static async Task<PaginatedList<TEntity>> AsPaginatedAsync<TEntity>(this IQueryable<TEntity> query, PageModel pageModel)
            where TEntity : class
        {
            int page = pageModel.Page ?? 1;
            int pageSize = pageModel.PageSize ?? 10;
            var skip = (page - 1) * pageSize;

            var result = new PaginatedList<TEntity>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = await query.CountAsync(),
                Results = await query.Skip(skip).Take(pageSize).AsNoTracking().ToArrayAsync()
            };

            return result;
        }
    }
}
