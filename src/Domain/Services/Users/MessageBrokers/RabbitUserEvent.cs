using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MassTransit;
using PC.Models.Users;
using Web.MessageBrokers.Exceptions;
using Web.MessageBrokers.Messages;

namespace Domain.Services.Users.MessageBrokers
{
    public class RabbitUserEvent : IUserEvent
    {
        private readonly IPublishEndpoint _publishEndpoint;

        public RabbitUserEvent(IPublishEndpoint publishEndpoint)
        {
            _publishEndpoint = publishEndpoint;
        }

        public async Task UpdateAsync(User user)
        {
            await PublishAsync(new UserUpdateMessage(user));
        }

        public async Task CreateAsync(User user)
        {
            await PublishAsync(new UserCreateMessage(user));
        }

        public async Task CreateAsync(IReadOnlyCollection<User> users)
        {
            await PublishAsync(new UsersImportMessage(users));
        }

        public async Task DeleteAsync(string userName)
        {
            await PublishAsync(new UserDeleteMessage(userName));
        }

        public Task RestoreAsync(User user)
        {
            return Task.CompletedTask;
        }

        public async Task RemoveAsync(string userName)
        {
            await PublishAsync(new UserRemoveMessage(userName));
        }

        private async Task PublishAsync<TMessage>(TMessage message)
            where TMessage : class, new()
        {
            try
            {
                await _publishEndpoint.Publish(message);
            }
            catch (Exception exception)
            {
                throw new CannotPublishMessageException<TMessage>(exception);
            }
        }
    }
}
