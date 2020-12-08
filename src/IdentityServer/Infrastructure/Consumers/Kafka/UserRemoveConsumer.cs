using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using Microsoft.Extensions.DependencyInjection;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UserRemoveConsumer : BaseKafkaConsumer<UserRemoveMessage>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UserRemoveConsumer(IServiceScopeFactory scopeFactory)
            : base(UserRemoveMessage.Queue)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(UserRemoveMessage message)
        {
            using var scope = _scopeFactory.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IUserServiceForIdentityServer>();
            await service.RemoveAsync(message.UserName);
        }
    }
}