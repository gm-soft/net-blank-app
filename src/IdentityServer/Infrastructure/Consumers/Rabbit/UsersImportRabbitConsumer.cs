using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Messages;
using Web.MessageBrokers.RabbitMQ;

namespace IdentityServer.Infrastructure.Consumers.Rabbit
{
    public class UsersImportRabbitConsumer : BaseRabbitConsumer<UsersImportMessage>
    {
        public const string Queue = "users-import-queue";

        public UsersImportRabbitConsumer(ILogger<UsersImportRabbitConsumer> logger)
            : base(logger)
        {
        }

        protected override Task ConsumeAsync(ConsumeContext<UsersImportMessage> context)
        {
            return Task.CompletedTask;
        }
    }
}