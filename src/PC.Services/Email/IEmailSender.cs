using System.Threading.Tasks;
using PC.Services.Email.Models;
using SendGrid;

namespace PC.Services.Email
{
    public interface IEmailSender
    {
        Task<Response> SendSingleEmailAsync(IEmailContent email);
    }
}