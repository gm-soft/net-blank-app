using System.Threading.Tasks;
using PC.Domain.Services.Email.Models;

namespace PC.Domain.Services.Email
{
    public interface IEmailPreviewService
    {
        Task<IEmailContent> InvitationEmailAsync();
    }
}