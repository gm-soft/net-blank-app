using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace PC.BL.ScheduleJobs
{
    public class SayHelloJob : InvocableJobBase
    {
        public SayHelloJob(ILogger<SayHelloJob> logger)
            : base(logger)
        {
        }

        protected override Task InvokeAsync()
        {
            Logger.LogInformation("Hello");
            return Task.CompletedTask;
        }
    }
}