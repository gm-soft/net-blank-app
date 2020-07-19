using Coravel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PC.BL.ScheduleJobs;

namespace Company.Core.Api.Config
{
    public static class ScheduleConfig
    {
        public static IServiceCollection AddCoravelScheduler(this IServiceCollection services)
        {
            services
                .AddScheduler()
                .AddTransient<SayHelloJob>();

            return services;
        }

        public static void SetupSchedulerTasks(this IApplicationBuilder app)
        {
            app.ApplicationServices.UseScheduler((scheduler) =>
            {
                scheduler
                    .Schedule<SayHelloJob>()
                    .DailyAtHour(0);
            });
        }
    }
}