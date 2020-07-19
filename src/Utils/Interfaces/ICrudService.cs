using System.Collections.Generic;
using System.Threading.Tasks;

namespace Utils.Interfaces
{
    public interface ICrudService<TModel>
        where TModel : class, IBaseModel
    {
        Task<TModel> GetByIdAsync(long id);

        Task<IReadOnlyCollection<TModel>> GetAllAsync();

        Task<long> InsertAsync(TModel model);

        Task UpdateAsync(TModel data);

        Task DeleteAsync(long id);
    }
}