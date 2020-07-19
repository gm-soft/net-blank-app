using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Interfaces;
using Utils.Validators;

namespace PC.Database.Repositories.Base
{
    public abstract class Repository<TDatabaseEntity, TEntity> : IRepository<TDatabaseEntity, TEntity>
        where TDatabaseEntity : class, IBaseModel
        where TEntity : class, IBaseModel
    {
        protected DatabaseContext Context { get; }

        protected IMapper Mapper { get; }

        protected Repository(DatabaseContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        protected virtual IQueryable<TDatabaseEntity> GetAllInternal()
        {
            return Context.Set<TDatabaseEntity>();
        }

        public virtual async Task<IReadOnlyCollection<TEntity>> GetAllAsync()
        {
            return Mapper.Map<IReadOnlyCollection<TEntity>>(await Context.Set<TDatabaseEntity>().ToArrayAsync());
        }

        // TODO Maxim: unittests
        public virtual async Task<TEntity> GetByIdOrNullAsync(long id)
        {
            return Mapper.Map<TEntity>(await GetByIdOrNullInternalAsync(id));
        }

        protected async Task<TDatabaseEntity> GetByIdOrNullInternalAsync(long id)
        {
            return await GetAllInternal().FirstOrDefaultAsync(x => x.Id == id);
        }

        // TODO Maxim: unittests
        public virtual async Task<TEntity> GetByIdOrFailAsync(long id)
        {
            return Mapper.Map<TEntity>(await GetByIdOrFailInternalAsync(id));
        }

        protected async Task<TDatabaseEntity> GetByIdOrFailInternalAsync(long id)
        {
            return await GetByIdOrNullInternalAsync(id) ?? throw ResourceNotFoundException.CreateFromEntity<TEntity>(id);
        }

        protected abstract TDatabaseEntity TransformForInsertion(TEntity entity);

        public virtual async Task<long> InsertAsync(TEntity entity)
        {
            entity.ThrowIfNull(nameof(entity));

            TDatabaseEntity databaseEntity = TransformForInsertion(entity)
                ?? throw new InvalidOperationException("You should not return null");

            databaseEntity.ThrowIfInvalid();

            EntityEntry<TDatabaseEntity> entry = await Context.Set<TDatabaseEntity>().AddAsync(databaseEntity);
            await Context.SaveChangesAsync();

            return entry.Entity.Id;
        }

        public virtual async Task UpdateAsync(long id, TEntity data)
        {
            data.ThrowIfNull(nameof(data));

            TDatabaseEntity entity = await GetByIdOrFailInternalAsync(id);

            UpdateInternal(data, entity);

            entity.ThrowIfInvalid();

            await Context.SaveChangesAsync();
        }

        protected abstract void UpdateInternal(TEntity data, TDatabaseEntity entity);

        public virtual async Task DeleteAsync(long id)
        {
            TDatabaseEntity entity = await GetByIdOrFailInternalAsync(id);
            Context.Set<TDatabaseEntity>().Remove(entity);

            await Context.SaveChangesAsync();
        }

        public async Task DoWithinTransactionAsync(Func<Task> action, string errorMessage = null)
        {
            action.ThrowIfNull(nameof(action));

            try
            {
                await Context.Database.BeginTransactionAsync();

                await action();

                Context.Database.CommitTransaction();
            }
            catch (Exception exception)
            {
                Context.Database.RollbackTransaction();
                const string defaultError = "Cannot execute transaction due to database error";
                throw new InvalidOperationException(errorMessage ?? defaultError, exception);
            }
        }

        public async Task<bool> CheckForEntityExistenceAsync(long id)
        {
            return await Context.Set<TDatabaseEntity>().AnyAsync(x => x.Id == id);
        }
    }
}
