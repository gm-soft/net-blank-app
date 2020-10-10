using System.Threading.Tasks;

namespace PC.Domain.Services.Email
{
    public interface IViewRenderer
    {
        Task<string> RenderAsync<TModel>(string viewName, TModel model);
    }
}