using System.Threading.Tasks;

namespace Web.MessageBrokers.Kafka
{
    public interface IProducer
    {
        Task PublishAsync<T>(string topic, T message);
    }
}