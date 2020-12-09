using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using PC.Models.Users;
using Web.MessageBrokers.Exceptions;
using Web.MessageBrokers.Messages;

namespace Domain.Services.Users.MessageBrokers
{
    public class RabbitUserEvent : IUserEvent
    {
        private readonly ILogger<RabbitUserEvent> _logger;
        private readonly IPublishEndpoint _publishEndpoint;

        public RabbitUserEvent(IPublishEndpoint publishEndpoint, ILogger<RabbitUserEvent> logger)
        {
            _publishEndpoint = publishEndpoint;
            _logger = logger;
        }

        public async Task UpdateAsync(User user)
        {
            await PublishAsync(new UserChangeMessage(user, ChangeType.Update));
        }

        public async Task CreateAsync(User user)
        {
            await PublishAsync(new UserChangeMessage(user, ChangeType.Create));
        }

        public async Task CreateAsync(IReadOnlyCollection<User> users)
        {
            await PublishAsync(new UserChangeMessage(users, ChangeType.BulkImport));
        }

        public async Task DeleteAsync(User user)
        {
            await PublishAsync(new UserChangeMessage(user, ChangeType.SoftDelete));
        }

        public async Task RestoreAsync(User user)
        {
            await PublishAsync(new UserChangeMessage(user, ChangeType.Restore));
        }

        public async Task RemoveAsync(User user)
        {
            await PublishAsync(new UserChangeMessage(user, ChangeType.Remove));
        }

        private async Task PublishAsync(UserChangeMessage message)
        {
            try
            {
                _logger.LogInformation($"Publish to topic {UserChangeMessage.Queue}:{message.ChangeType}");
                await _publishEndpoint.Publish(message);
            }
            catch (Exception exception)
            {
                throw new CannotPublishMessageException<UserChangeMessage>(exception);
            }
        }
    }
}
