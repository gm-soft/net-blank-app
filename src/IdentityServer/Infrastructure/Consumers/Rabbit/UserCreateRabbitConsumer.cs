using System.Threading.Tasks;
using IdentityServer.Infrastructure.Consumers.Kafka;
using MassTransit;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Messages;
using Web.MessageBrokers.RabbitMQ;

namespace IdentityServer.Infrastructure.Consumers.Rabbit
{
    public class UserCreateRabbitConsumer : BaseRabbitConsumer<UserCreateMessage>
    {
        public const string Queue = "user-create-queue";

        public UserCreateRabbitConsumer(ILogger<UserCreateKafkaConsumer> logger)
            : base(logger)
        {
        }

        protected override Task ConsumeAsync(ConsumeContext<UserCreateMessage> context)
        {
            return Task.CompletedTask;
        }
    }
}