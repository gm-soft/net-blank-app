using AutoMapper;
using Company.IdentityServer.Config;
using Company.IdentityServer.Extensions;
using Company.IdentityServer.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using PC.BL.Logging;
using PC.Database;
using PC.Services.Mappings;
using Serilog;

namespace Company.IdentityServer
{
    public class Startup
    {
        private const string CorsPolicyName = "CorsPolicy";

        private readonly ApplicationLoggerBuilder _loggerBuilder;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;

            _loggerBuilder = new ApplicationLoggerBuilder(configuration);
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Logger = _loggerBuilder.Logger();

            AddControllers(services);

            IdentityModelEventSource.ShowPII = true;

            services
                .AddDbContextPool<DatabaseContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

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

            services.AddAutoMapper(CoreMappings.GetAssembly());
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
                app.UseMiddleware<ExceptionHandlerMiddleware>();

                // The default HSTS value is 30 days.
                // You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            loggerFactory.AddSerilog();

            app.UseApplicationLogger();

            app.UseIdentityServer();
            app.UseAuthentication();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors(CorsPolicyName);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });

            app.WaitForDatabase();
        }
    }
}
