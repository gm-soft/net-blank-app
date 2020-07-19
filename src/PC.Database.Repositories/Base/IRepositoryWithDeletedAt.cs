using System.Collections.Generic;
using System.Threading.Tasks;
using Utils.Interfaces;

namespace PC.Database.Repositories.Base
{
    public interface IRepositoryWithDeletedAt<TDatabaseEntity, TEntity> : IRepository<TDatabaseEntity, TEntity>
        where TDatabaseEntity : class, IBaseModel, IHasDeletedAt
        where TEntity : class, IBaseModel, IHasDeletedAt
    {
        Task<IReadOnlyCollection<TEntity>> GetAllWithDeletedAsync();
    }
}