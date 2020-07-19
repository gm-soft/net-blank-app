using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Utils.Interfaces;

namespace PC.Database.Repositories.Base
{
    public abstract class RepositoryWithDeletedAt<TDatabaseEntity, TEntity>
        : Repository<TDatabaseEntity, TEntity>, IRepositoryWithDeletedAt<TDatabaseEntity, TEntity>
        where TDatabaseEntity : class, IBaseModel, IHasDeletedAt
        where TEntity : class, IBaseModel, IHasDeletedAt
    {
        protected RepositoryWithDeletedAt(DatabaseContext context, IMapper mapper)
            : base(context, mapper)
        {
        }

        protected override IQueryable<TDatabaseEntity> GetAllInternal()
        {
            return base.GetAllInternal().Where(x => x.DeletedAt == null);
        }

        public override async Task DeleteAsync(long id)
        {
            TDatabaseEntity entity = await GetByIdOrFailInternalAsync(id);
            entity.DeletedAt = DateTimeOffset.Now;

            await Context.SaveChangesAsync();
        }

        public async Task<IReadOnlyCollection<TEntity>> GetAllWithDeletedAsync()
        {
            return Mapper.Map<IReadOnlyCollection<TEntity>>(await base.GetAllInternal().ToArrayAsync());
        }
    }
}