using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Users;
using Utils.Interfaces;

namespace PC.Domain.Services.User
{
    public interface IUserService : ICrudService<ApplicationUser>
    {
        Task<int> ImportAsync(IReadOnlyCollection<ApplicationUser> users);

        Task<IReadOnlyCollection<ApplicationUser>> SearchAsync(string searchString);
    }
}