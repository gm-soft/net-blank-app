using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UsersImportKafkaConsumer : BaseKafkaConsumer<UsersImportMessage>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UsersImportKafkaConsumer(IServiceScopeFactory scopeFactory)
            : base(UsersImportMessage.Queue)
        {
            _scopeFactory = scopeFactory;
        }

        protected override Task ExecuteAsync(UsersImportMessage message)
        {
            return Task.CompletedTask;
        }
    }
}