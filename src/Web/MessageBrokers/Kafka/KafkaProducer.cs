using System.Threading.Tasks;
using Confluent.Kafka;
using Newtonsoft.Json;
using Utils.Helpers;

namespace Web.MessageBrokers.Kafka
{
    public class KafkaProducer : IProducer
    {
        private readonly ProducerConfig _config;

        public KafkaProducer(AppKafkaOptions configuration)
        {
            _config = configuration.ProducerConfig();
        }

        public async Task PublishAsync<T>(string topic, T message)
        {
            message.ThrowIfNull(nameof(message));

            using var producer = new ProducerBuilder<string, string>(_config).Build();
            var value = JsonConvert.SerializeObject(message);

            await producer.ProduceAsync(topic, new Message<string, string> { Value = value });

            producer.Flush();
        }
    }
}