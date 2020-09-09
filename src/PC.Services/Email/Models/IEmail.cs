using System.Threading.Tasks;

namespace PC.Services.Email.Models
{
    public interface IEmail
    {
        Task<IEmailContent> RenderAsync();
    }
}