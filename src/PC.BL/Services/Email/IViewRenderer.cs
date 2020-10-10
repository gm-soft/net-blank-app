using System.Threading.Tasks;

namespace PC.Services.Email
{
    public interface IViewRenderer
    {
        Task<string> RenderAsync<TModel>(string viewName, TModel model);
    }
}