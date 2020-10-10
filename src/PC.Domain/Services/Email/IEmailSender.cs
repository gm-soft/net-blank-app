using System.Threading.Tasks;
using PC.Domain.Services.Email.Models;
using SendGrid;

namespace PC.Domain.Services.Email
{
    public interface IEmailSender
    {
        Task<Response> SendSingleEmailAsync(IEmailContent email);
    }
}