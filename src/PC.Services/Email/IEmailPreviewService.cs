using System.Threading.Tasks;
using PC.Services.Email.Models;

namespace PC.Services.Email
{
    public interface IEmailPreviewService
    {
        Task<IEmailContent> InvitationEmailAsync();
    }
}