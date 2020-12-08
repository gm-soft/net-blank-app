using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UserUpdateKafkaConsumer : BaseKafkaConsumer<UserUpdateMessage>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UserUpdateKafkaConsumer(IServiceScopeFactory scopeFactory)
            : base(UserUpdateMessage.Queue)
        {
            _scopeFactory = scopeFactory;
        }

        protected override Task ExecuteAsync(UserUpdateMessage message)
        {
            return Task.CompletedTask;
        }
    }
}