using IdentityServer.Config;
using IdentityServer.Config.IdentityServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Serilog;
using Web.Health;
using Web.Logging;
using Web.Middlewares;

namespace IdentityServer
{
    public class Startup
    {
        private const string CorsPolicyName = "CorsPolicy";

        private readonly ApplicationLoggerBuilder _loggerBuilder;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;

            _loggerBuilder = new ApplicationLoggerBuilder(configuration, Environment);
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Logger = _loggerBuilder.Logger();

            AddControllers(services);

            IdentityModelEventSource.ShowPII = true;
            services.AddHttpContextAccessor();
            services.AddDistributedMemoryCache();
            services.AddSession();

            services
                .AddDbContext<DatabaseContext>(options =>
                    options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentityServerSettings(Configuration);

            services
                .AddGoogleAuth(Configuration)
                .AddApplicationServices(Configuration);

            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicyName, builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services
                .HealthCheck(Configuration);

            services.AddIdentityMassTransit(Configuration);
        }

        private void AddControllers(IServiceCollection services)
        {
            if (Environment.IsDevelopment())
            {
                services
                    .AddControllersWithViews()
                    .AddRazorRuntimeCompilation();
            }
            else
            {
                services.AddControllersWithViews();
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // The default HSTS value is 30 days.
                // You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSession();

            loggerFactory.AddSerilog();

            app.UseMiddleware<LoggingMiddleware>();

            app.UseIdentityServer();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors(CorsPolicyName);
            app.UseAuthorization();

            const string healthCheckRoute = "/health";

            app.UseHealthChecks(healthCheckRoute, new HealthCheckCustomResponse());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapHealthChecks(healthCheckRoute);
            });

            app.Migrate();

            // Should be placed at the end of this method.
            app.UseMiddleware<DefaultNotFoundPageMiddleware>();
        }
    }
}
