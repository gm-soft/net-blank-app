using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Utils.ValueObjects;

namespace Web.MessageBrokers.Kafka
{
    public class AppKafkaOptions
    {
        private readonly IConfigurationSection _section;

        public AppKafkaOptions(IConfiguration configuration)
        {
            _section = configuration.GetSection("MessageBroker");
        }

        public ProducerConfig ProducerConfig()
        {
            var host = new NonNullableString(_section["KafkaHost"]);

            return new ProducerConfig
            {
                BootstrapServers = host.Value(),
                MessageTimeoutMs = 3000
            };
        }

        public ConsumerConfig ConsumerConfig()
        {
            return new ConsumerConfig(ProducerConfig())
            {
                GroupId = new NonNullableString(_section["GroupId"]).Value(),
                AllowAutoCreateTopics = true
            };
        }
    }
}