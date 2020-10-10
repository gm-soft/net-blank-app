using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using PC.Database;

namespace PC.Domain.Middlewares
{
    public class TransactionMiddleware : IMiddleware
    {
        private readonly RequestDelegate _next;

        public TransactionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var databaseContext = context.RequestServices.GetRequiredService<DatabaseContext>();
            using (var dbTransaction = await databaseContext.Database.BeginTransactionAsync())
            {
                try
                {
                    await _next(context);

                    await dbTransaction.CommitAsync();
                }
                catch
                {
                    await dbTransaction.RollbackAsync();

                    throw;
                }
            }
        }
    }
}