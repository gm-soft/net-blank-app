using System.Collections.Generic;
using System.Threading.Tasks;
using PC.Models.Email;
using SendGrid;
using Utils.Interfaces;

namespace PC.Services.Email
{
    public interface IEmailSender
    {
        Task<Response> SendSingleEmailAsync(EmailModel model);

        Task<Response> SendSingleEmailAsync(string body, string subject, List<string> recipients, List<string> cc = null);
    }
}