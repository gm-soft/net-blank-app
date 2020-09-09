using System.Threading.Tasks;
using Utils.Interfaces;

namespace TestUtils.Extensions
{
    public static class CrudServiceExtensions
    {
        public static async Task<TModel> UpdateAndGetAsync<TModel>(this ICrudService<TModel> service, TModel data)
            where TModel : class, IBaseModel
        {
            await service.UpdateAsync(data);

            return await service.GetByIdAsync(data.Id);
        }
    }
}