using System.Threading.Tasks;
using Newtonsoft.Json;
using Utils.Helpers;

namespace Web.MessageBrokers.Kafka
{
    public abstract class BaseKafkaConsumer<TMessage> : IKafkaConsumer
        where TMessage : class
    {
        protected BaseKafkaConsumer(string topicName)
        {
            Topic = topicName;
        }

        protected abstract Task ExecuteAsync(TMessage message);

        public string Topic { get; }

        public async Task ConsumeAsync(string message)
        {
            message.ThrowIfNull(nameof(message));

            await ExecuteAsync(JsonConvert.DeserializeObject<TMessage>(message));
        }
    }
}