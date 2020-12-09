using System;
using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UserChangeConsumer : BaseKafkaConsumer<UserChangeMessage>
    {
        private readonly ILogger<UserChangeConsumer> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        public UserChangeConsumer(IServiceScopeFactory scopeFactory, ILogger<UserChangeConsumer> logger)
            : base(UserChangeMessage.Queue)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(UserChangeMessage message)
        {
            using var scope = _scopeFactory.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IUserServiceForIdentityServer>();

            _logger.LogInformation($"Consumed from {UserChangeMessage.Queue}:{message.ChangeType}");

            switch (message.ChangeType)
            {
                case ChangeType.Create:
                    // TODO https://petrelai.atlassian.net/browse/PIC-750
                    break;

                case ChangeType.BulkImport:
                    // TODO https://petrelai.atlassian.net/browse/PIC-750
                    break;

                case ChangeType.Update:
                    // TODO https://petrelai.atlassian.net/browse/PIC-751
                    break;

                case ChangeType.Restore:
                    await service.RestoreAsync(message.User().UserName);
                    break;

                case ChangeType.SoftDelete:
                    await service.DeleteAsync(message.User().UserName);
                    break;

                case ChangeType.Remove:
                    await service.RemoveAsync(message.User().UserName);
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}