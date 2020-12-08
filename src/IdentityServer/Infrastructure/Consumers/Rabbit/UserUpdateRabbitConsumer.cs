using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using MassTransit;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Messages;
using Web.MessageBrokers.RabbitMQ;

namespace IdentityServer.Infrastructure.Consumers.Rabbit
{
    public class UserUpdateRabbitConsumer : BaseRabbitConsumer<UserUpdateMessage>
    {
        public const string Queue = "user-update-queue";

        private readonly IUserServiceForIdentityServer _userServiceForIdentityServer;

        public UserUpdateRabbitConsumer(IUserServiceForIdentityServer userServiceForIdentityServer, ILogger<UserUpdateRabbitConsumer> logger)
            : base(logger)
        {
            _userServiceForIdentityServer = userServiceForIdentityServer;
        }

        protected async override Task ConsumeAsync(ConsumeContext<UserUpdateMessage> context)
        {
            var user = new Database.Models.User(context.Message.User);

            await _userServiceForIdentityServer.UpdateAsync(user);
        }
    }
}