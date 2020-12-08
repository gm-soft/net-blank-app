using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using Microsoft.Extensions.DependencyInjection;
using Web.MessageBrokers.Kafka;
using Web.MessageBrokers.Messages;

namespace IdentityServer.Infrastructure.Consumers.Kafka
{
    public class UserDeleteConsumer : BaseKafkaConsumer<UserDeleteMessage>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UserDeleteConsumer(IServiceScopeFactory scopeFactory)
            : base(UserDeleteMessage.Queue)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(UserDeleteMessage message)
        {
            using var scope = _scopeFactory.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IUserServiceForIdentityServer>();
            await service.DeleteAsync(message.UserName);
        }
    }
}