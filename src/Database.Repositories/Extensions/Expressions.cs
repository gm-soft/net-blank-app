using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Utils.Dates;
using Utils.Interfaces;
using Utils.Pagination;

namespace Database.Repositories.Extensions
{
    public static class Expressions
    {
        public static Expression<Func<T, bool>> HasIntersection<T>(Date from, Date to)
            where T : class, IHasFromToDates
        {
            var fromAsDateTime = from.StartOfTheDay();
            var toAsDateTime = to.EndOfTheDay();

            return v => (v.From >= fromAsDateTime && v.To <= toAsDateTime) ||
                        (v.To >= fromAsDateTime && v.To <= toAsDateTime) ||
                        (v.From >= fromAsDateTime && v.From <= toAsDateTime) ||
                        (v.From < fromAsDateTime && v.To > toAsDateTime);
        }

        public static async Task<PaginatedList<TEntity>> AsPaginatedAsync<TEntity>(
            this IQueryable<TEntity> query, PageModel pageModel)
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