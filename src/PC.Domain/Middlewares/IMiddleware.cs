using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace PC.Domain.Middlewares
{
    public interface IMiddleware
    {
        Task InvokeAsync(HttpContext context);
    }
}