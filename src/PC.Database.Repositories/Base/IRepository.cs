using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Utils.Interfaces;

namespace PC.Database.Repositories.Base
{
    public interface IRepository<TDatabaseEntity, TEntity>
        where TDatabaseEntity : class, IBaseModel
        where TEntity : class, IBaseModel
    {
        Task<TEntity> GetByIdOrNullAsync(long id);

        Task<TEntity> GetByIdOrFailAsync(long id);

        Task<bool> CheckForEntityExistenceAsync(long id);

        Task<IReadOnlyCollection<TEntity>> GetAllAsync();

        Task<long> InsertAsync(TEntity entity);

        Task UpdateAsync(long id, TEntity data);

        Task DeleteAsync(long id);
    }
}
