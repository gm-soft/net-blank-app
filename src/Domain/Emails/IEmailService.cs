using System.Threading.Tasks;
using Domain.Emails.Models;

namespace Domain.Emails
{
    public interface IEmailService
    {
        Task SendCustomEmailAsync(EmailContent emailContent);
    }
}
