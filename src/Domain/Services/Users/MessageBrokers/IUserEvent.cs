using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Users;

namespace Domain.Services.Users.MessageBrokers
{
    public interface IUserEvent
    {
        Task UpdateAsync(User user);

        Task CreateAsync(User user);

        Task CreateAsync(IReadOnlyCollection<User> users);

        Task DeleteAsync(string userName);

        Task RestoreAsync(User user);

        Task RemoveAsync(string userName);
    }
}
