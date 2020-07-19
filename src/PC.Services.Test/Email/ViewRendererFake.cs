using System.Threading.Tasks;
using PC.Services.Email;

namespace PC.Services.Test.Email
{
    public class ViewRendererFake : IViewRenderer
    {
        public Task<string> RenderAsync<TModel>(string viewName, TModel model)
        {
            return Task.FromResult("<div> hello world </div>");
        }
    }
}