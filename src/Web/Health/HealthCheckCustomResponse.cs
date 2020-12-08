using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Newtonsoft.Json;

namespace Web.Health
{
    public class HealthCheckCustomResponse : HealthCheckOptions
    {
        public HealthCheckCustomResponse()
        {
            ResponseWriter = WriteAsync;
        }

        private static async Task WriteAsync(HttpContext context, HealthReport report)
        {
            context.Response.ContentType = "application/json";

            var result = JsonConvert.SerializeObject(new
            {
                status = report.Status.ToString(),
                errors = report.Entries.Select(e => new { key = e.Key, value = e.Value.Status.ToString() })
            });
            await context.Response.WriteAsync(result);
        }
    }
}