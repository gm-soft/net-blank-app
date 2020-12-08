using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Utils.Web
{
    public interface IMiddleware
    {
        Task InvokeAsync(HttpContext context);
    }
}