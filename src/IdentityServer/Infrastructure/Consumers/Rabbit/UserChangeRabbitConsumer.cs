using System;
using System.Threading.Tasks;
using IdentityServer.Infrastructure.Services.User;
using MassTransit;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Messages;
using Web.MessageBrokers.RabbitMQ;

namespace IdentityServer.Infrastructure.Consumers.Rabbit
{
    public class UserChangeRabbitConsumer : BaseRabbitConsumer<UserChangeMessage>
    {
        public const string Queue = "user-change-queue";

        private readonly IUserServiceForIdentityServer _service;

        public UserChangeRabbitConsumer(ILogger<UserChangeRabbitConsumer> logger, IUserServiceForIdentityServer service)
            : base(logger)
        {
            _service = service;
        }

        protected override async Task ConsumeAsync(ConsumeContext<UserChangeMessage> context)
        {
            Logger.LogInformation($"Consumed from {UserChangeMessage.Queue}:{context.Message.ChangeType}");

            switch (context.Message.ChangeType)
            {
                case ChangeType.Create:
                    break;

                case ChangeType.BulkImport:
                    break;

                case ChangeType.Update:
                    break;

                case ChangeType.Restore:
                    await _service.RestoreAsync(context.Message.User().UserName);
                    break;

                case ChangeType.SoftDelete:
                    await _service.DeleteAsync(context.Message.User().UserName);
                    break;

                case ChangeType.Remove:
                    await _service.RemoveAsync(context.Message.User().UserName);
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}