using System.Threading.Tasks;

namespace Domain.Emails
{
    public interface IViewRenderer
    {
        Task<string> RenderAsync<TModel>(string viewName, TModel model);
    }
}