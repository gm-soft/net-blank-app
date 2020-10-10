using System.Threading.Tasks;
using PC.Domain.Services.Email;

namespace PC.Domain.Test.Services.Email
{
    public class ViewRendererFake : IViewRenderer
    {
        public Task<string> RenderAsync<TModel>(string viewName, TModel model)
        {
            return Task.FromResult("<div> hello world </div>");
        }
    }
}