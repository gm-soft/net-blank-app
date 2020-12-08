using System;
using MassTransit;
using MassTransit.ExtensionsDependencyInjectionIntegration;
using MassTransit.RabbitMqTransport;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Utils.ValueObjects;

namespace Web.MessageBrokers.RabbitMQ
{
    public static class MassTransitConfig
    {
        public static IServiceCollection SetupMassTransit(
            this IServiceCollection services,
            NonNullable<string> hostString,
            Action<IServiceCollectionBusConfigurator> addConsumers = null,
            Action<IBusRegistrationContext, IRabbitMqBusFactoryConfigurator> configureConsumers = null)
        {
            services.AddMassTransit((IServiceCollectionBusConfigurator x) =>
            {
                addConsumers?.Invoke(x);

                x.UsingRabbitMq((IBusRegistrationContext ctx, IRabbitMqBusFactoryConfigurator cfg) =>
                    {
                        cfg.Host(hostString.Value());

                        cfg.UseJsonSerializer();

                        configureConsumers?.Invoke(ctx, cfg);
                    });
            });

            services.AddMassTransitHostedService();

            services.Configure<HealthCheckPublisherOptions>(options =>
            {
                options.Delay = TimeSpan.FromSeconds(2);
                options.Predicate = (check) => check.Tags.Contains("ready");
            });

            return services;
        }
    }
}