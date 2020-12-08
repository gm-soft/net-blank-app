using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UserCreateKafkaConsumer : BaseKafkaConsumer<UserCreateMessage>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UserCreateKafkaConsumer(IServiceScopeFactory scopeFactory)
            : base(UserCreateMessage.Queue)
        {
            _scopeFactory = scopeFactory;
        }

        protected override Task ExecuteAsync(UserCreateMessage message)
        {
            return Task.CompletedTask;
        }
    }
}