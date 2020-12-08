using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Services.Users.MessageBrokers;
using PC.Models.Users;

namespace TestUtils.ServiceStubs
{
    public class UserEventStub : IUserEvent
    {
        public Task UpdateAsync(User user)
        {
            Console.WriteLine($"User update event\r\n{user}");
            return Task.CompletedTask;
        }

        public Task CreateAsync(User user)
        {
            Console.WriteLine($"User create event\r\n{user}");
            return Task.CompletedTask;
        }

        public Task CreateAsync(IReadOnlyCollection<User> users)
        {
            Console.WriteLine($"User create event\r\nusers: {users.Count}");
            return Task.CompletedTask;
        }

        public Task DeleteAsync(string userName)
        {
            Console.WriteLine($"User soft delete event\r\n{userName}");
            return Task.CompletedTask;
        }

        public Task RestoreAsync(User user)
        {
            Console.WriteLine($"User restore event\r\n{user}");
            return Task.CompletedTask;
        }

        public Task RemoveAsync(string userName)
        {
            Console.WriteLine($"User remove event\r\n{userName}");
            return Task.CompletedTask;
        }
    }
}