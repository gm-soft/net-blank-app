using System.Threading.Tasks;

namespace PC.Domain.Services.Email.Models
{
    public interface IEmail
    {
        Task<IEmailContent> RenderAsync();
    }
}