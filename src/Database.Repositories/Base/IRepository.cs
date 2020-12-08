using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Utils.Interfaces;

namespace PC.Database.Repositories.Base
{
    public interface IRepository<TEntity>
        where TEntity : class, IBaseModel
    {
        Task<TEntity> GetByIdOrNullAsync(long id);

        Task<TEntity> GetByIdOrFailAsync(long id);

        Task<bool> HasEntityAsync(long id);

        Task<IReadOnlyCollection<TEntity>> GetAllAsync();

        Task<long> InsertAsync(TEntity entity);

        Task UpdateAsync(TEntity data);

        // TODO maxim: create overload DeleteAsync(TEntity entity)
        Task DeleteAsync(long id);

        /// <summary>
        /// Returns simple model without additional inclusions.
        /// </summary>
        /// <param name="id">Entity id.</param>
        /// <returns>Simple entity.</returns>
        Task<TEntity> SimpleOrFailAsync(long id);
    }
}
