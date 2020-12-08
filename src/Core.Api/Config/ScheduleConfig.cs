using Coravel;
using Domain.ScheduleJobs;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Api.Config
{
    public static class ScheduleConfig
    {
        public static IServiceCollection AddCoravelScheduler(this IServiceCollection services)
        {
            services
                .AddScheduler()
                .AddTransient<HelloJob>();

            return services;
        }

        public static void SetupSchedulerTasks(this IApplicationBuilder app)
        {
            app.ApplicationServices.UseScheduler((scheduler) =>
            {
                scheduler
                    .Schedule<HelloJob>()
                    .DailyAtHour(0);
            });
        }
    }
}