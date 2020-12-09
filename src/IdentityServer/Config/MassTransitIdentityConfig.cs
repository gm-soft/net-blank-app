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
                    cfg.AddConsumer<UserChangeRabbitConsumer>();
                },
                configureConsumers: (context, cfg) =>
                {
                    cfg.ReceiveEndpoint(UserChangeRabbitConsumer.Queue, e =>
                    {
                        e.ConfigureConsumer<UserChangeRabbitConsumer>(context);
                    });
                });

            return services;
        }
    }
}