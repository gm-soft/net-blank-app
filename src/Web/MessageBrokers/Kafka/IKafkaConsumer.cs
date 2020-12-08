using System.Threading.Tasks;

namespace Web.MessageBrokers.Kafka
{
    public interface IKafkaConsumer
    {
        string Topic { get; }

        Task ConsumeAsync(string message);
    }
}