using Coravel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Company.Core.Api.Config
{
    public static class ScheduleConfig
    {
        public static IServiceCollection AddCoravelScheduler(this IServiceCollection services)
        {
            services
                .AddScheduler();

            return services;
        }

        public static void SetupSchedulerTasks(this IApplicationBuilder app)
        {
            app.ApplicationServices.UseScheduler((scheduler) =>
            {
            });
        }
    }
}