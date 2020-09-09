using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace PC.BL.Middlewares
{
    public interface IMiddleware
    {
        Task InvokeAsync(HttpContext context);
    }
}