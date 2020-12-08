using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Coravel.Invocable;
using Microsoft.Extensions.Logging;

namespace Domain.ScheduleJobs
{
    public abstract class InvocableJobBase : IInvocable
    {
        protected ILogger Logger { get; }

        private string JobName => GetType().Name;

        protected InvocableJobBase(ILogger logger)
        {
            Logger = logger;
        }

        protected abstract Task InvokeAsync();

#pragma warning disable UseAsyncSuffix // Use Async suffix
        public async Task Invoke()
#pragma warning restore UseAsyncSuffix // Use Async suffix
        {
            Stopwatch stopwatch = null;
            try
            {
                stopwatch = Stopwatch.StartNew();

                await InvokeAsync();

                stopwatch.Stop();

                Logger.LogInformation(
                    $"Finished background task {JobName}. Execution time: {stopwatch.ElapsedMilliseconds}");
            }
            catch (Exception exception)
            {
                stopwatch?.Stop();

                Logger.LogError(
                    exception,
                    $"A task {JobName} has error: {exception.Message}");
            }
        }
    }
}