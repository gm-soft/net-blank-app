using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Domain.ScheduleJobs
{
    public class HelloJob : InvocableJobBase
    {
        public HelloJob(ILogger<HelloJob> logger)
            : base(logger)
        {
        }

        protected override Task InvokeAsync()
        {
            Logger.LogInformation("Hello job");
            return Task.CompletedTask;
        }
    }
}