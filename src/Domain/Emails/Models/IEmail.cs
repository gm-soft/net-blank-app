using System.Threading.Tasks;

namespace Domain.Emails.Models
{
    public interface IEmail
    {
        Task<IEmailContent> RenderAsync();
    }
}