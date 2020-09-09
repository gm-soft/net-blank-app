using System.Threading.Tasks;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Http;

namespace PC.BL.Middlewares
{
    /// <summary>
    /// This middleware should catch all unprocessed web-requests and replace them only if they were finished by 404 status code.
    /// The middleware should be placed always at the end of the Startup.Configure
    /// after standard .UseMvc() or .UseEndpoints() methods.
    /// </summary>
    public class DefaultNotFoundPageMiddleware : IMiddleware
    {
        private const int NotFoundStatusCode = 404;

        private readonly RequestDelegate _next;

        public DefaultNotFoundPageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode == NotFoundStatusCode && !context.Response.HasStarted)
            {
                await context.Response.WriteHtmlAsync(
$@"<!doctype html>
<html lang=""en"">
  <head>
    <!-- Required meta tags -->
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1, shrink-to-fit=no"">

    <!-- Bootstrap CSS -->
    <link rel=""stylesheet"" href=""https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"" integrity=""sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"" crossorigin=""anonymous"">

    <title>{NotFoundStatusCode}</title>
  </head>
  <body>
    <div class=""container"">
        <div class=""mt-3 text-center"">
            <div class=""page-header mt-3"">
                <h1 class=""text-danger display-1"">{NotFoundStatusCode}</h1>

                <div class=""mt-3"">
                    <span class=""h2 display-4"">¯\_(ツ)_/¯</span>
                </div>

                <div class=""mt-3"">
                    <div class=""h2 mb-3"">Url does not exist</div>
                    <div class=""mt-3"">
                        <em class=""h3 mt-3""><u>{context.Request.Path.Value}</u></em>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </body>
</html>");
            }
        }
    }
}