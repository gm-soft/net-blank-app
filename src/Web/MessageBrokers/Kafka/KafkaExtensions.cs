using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Web.MessageBrokers.Kafka
{
    public static class KafkaExtensions
    {
        public static IServiceCollection AddConsumer<T>(this IServiceCollection services)
            where T : class, IKafkaConsumer
        {
            if (services.Any(x => x.ServiceType == typeof(T)))
            {
                throw new ArgumentException($"You're trying to register consumer {typeof(T).Name} again");
            }

            return services.AddTransient<IKafkaConsumer, T>();
        }

        public static IHealthChecksBuilder AddKafkaHealthCheck(this IHealthChecksBuilder services, IConfiguration configuration)
        {
            return services.AddKafka(new AppKafkaOptions(configuration).ProducerConfig());
        }
    }
}