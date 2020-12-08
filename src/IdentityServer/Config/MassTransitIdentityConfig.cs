using IdentityServer.Infrastructure.Consumers.Rabbit;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Utils.ValueObjects;
using Web.MessageBrokers.RabbitMQ;

namespace IdentityServer.Config
{
    public static class MassTransitIdentityConfig
    {
        public static IServiceCollection AddIdentityMassTransit(this IServiceCollection services, IConfiguration configuration)
        {
            services.SetupMassTransit(
                hostString: new NonNullableString(
                    value: configuration.GetSection("MessageBroker")["RabbitHost"],
                    paramName: "(\"MessageBroker\")[\"RabbitHost\"]"),
                addConsumers: (cfg) =>
                {
                    cfg.AddConsumer<UserCreateRabbitConsumer>();
                    cfg.AddConsumer<UserUpdateRabbitConsumer>();
                    cfg.AddConsumer<UsersImportRabbitConsumer>();
                },
                configureConsumers: (context, cfg) =>
                {
                    cfg.ReceiveEndpoint(UserCreateRabbitConsumer.Queue, e =>
                    {
                        e.ConfigureConsumer<UserCreateRabbitConsumer>(context);
                    });

                    cfg.ReceiveEndpoint(UserUpdateRabbitConsumer.Queue, e =>
                    {
                        e.ConfigureConsumer<UserUpdateRabbitConsumer>(context);
                    });

                    cfg.ReceiveEndpoint(UsersImportRabbitConsumer.Queue, e =>
                    {
                        e.ConfigureConsumer<UsersImportRabbitConsumer>(context);
                    });
                });

            return services;
        }
    }
}