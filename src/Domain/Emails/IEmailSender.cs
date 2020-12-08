using System.Threading.Tasks;
using Domain.Emails.Models;
using Domain.Emails.Responses;

namespace Domain.Emails
{
    public interface IEmailSender
    {
        Task<IEmailResponse> SendSingleEmailAsync(IEmailContent email);
    }
}