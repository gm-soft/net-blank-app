using System.Threading.Tasks;
using Domain.Emails.Models;

namespace Domain.Emails
{
    public interface IEmailPreviewService
    {
        Task<IEmailContent> InvitationEmailAsync();

        Task<IEmailContent> CustomEmailAsync(EmailContent emailContent);
    }
}