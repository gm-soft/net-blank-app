#pragma warning disable SA1005, SA1515
//
//            God Bless         No Bugs
//
//
//
//                      _oo0oo_
//                     o8888888o
//                     88" . "88
//                     (| -_- |)
//                     0\  =  /0
//                   ___/`---'\___
//                 .' \\|     |// '.
//                / \\|||  :  |||// \
//               / _||||| -:- |||||- \
//              |   | \\\  -  /// |   |
//              | \_|  ''\---/''  |_/ |
//              \  .-\__  '-'  ___/-. /
//            ___'. .'  /--.--\  `. .'___
//         ."" '<  `.___\_<|>_/___.' >' "".
//        | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//        \  \ `_.   \_ __\ /__ _/   .-` /  /
//    =====`-.____`.___ \_____/___.-`___.-'=====
//                      `=---='
//
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
#pragma warning restore SA1005, SA1515
using AutoMapper;
using Core.Api.Config;
using Domain.Mappings;
using Domain.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Newtonsoft.Json;
using Serilog;
using Utils.ValueObjects;
using Web.Health;
using Web.Logging;
using Web.MessageBrokers.RabbitMQ;
using Web.Middlewares;

namespace Core.Api
{
    public class Startup
    {
        private const string CorsPolicyName = "CorsPolicy";

        private readonly ApplicationLoggerBuilder _loggerBuilder;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;

            _loggerBuilder = new ApplicationLoggerBuilder(Configuration, Environment);
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Logger = _loggerBuilder.Logger();

            services.AddControllers().AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            DatabaseConfig.Setup(services, Configuration, Environment);

            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicyName, builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(SwaggerConfig.SwaggerGenConfig);

            services
                .AddAutoMapper(CoreMappings.GetAssembly())
                .AddJwtAuth(Configuration)
                .AddClaimPolicies()
                .AddServices(Configuration, Environment)
                .AddCoravelScheduler()
                .HealthCheck(Configuration)
                .SetupMassTransit(
                hostString: new NonNullableString(
                    value: Configuration.GetSection("MessageBroker")["RabbitHost"],
                    paramName: "(\"MessageBroker\")[\"RabbitHost\"]"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // To debug identity issues.
                IdentityModelEventSource.ShowPII = true;
            }

            loggerFactory.AddSerilog();

            app
                .UseMiddleware<ExceptionHandlerMiddleware>()
                .UseMiddleware<LoggingMiddleware>();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors(CorsPolicyName);
            app.UseAuthentication();
            app.UseAuthorization();

            const string healthCheckRoute = "/health";

            app.UseHealthChecks(healthCheckRoute, new HealthCheckCustomResponse());

            app.SetupSchedulerTasks();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwagger();
            app.UseSwaggerUI(SwaggerConfig.SwaggerUIConfig);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks(healthCheckRoute);
            });

            app.MigrateOrFail();

            // Should be placed at the end of this method.
            app.UseMiddleware<DefaultNotFoundPageMiddleware>();
        }
    }
}
