using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database;
using Database.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PC.Database.Extensions;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Interfaces;
using Utils.Validators;

namespace PC.Database.Repositories.Base
{
    public abstract class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class, IBaseModel
    {
        protected DatabaseContext Context { get; }

        protected Repository(DatabaseContext context)
        {
            Context = context;
        }

        protected virtual IQueryable<TEntity> GetAllInternal()
        {
            return Context.Set<TEntity>();
        }

        public virtual async Task<IReadOnlyCollection<TEntity>> GetAllAsync()
        {
            return await Context.Set<TEntity>()
                .ToArrayAsync();
        }

        public virtual async Task<TEntity> GetByIdOrNullAsync(long id)
        {
            return await GetByIdOrNullInternalAsync(id);
        }

        public async Task<TEntity> SimpleOrFailAsync(long id)
        {
            return await Context.Set<TEntity>().ByIdOrNullAsync(id)
                   ?? throw ResourceNotFoundException.CreateFromEntity<TEntity>(id);
        }

        protected async Task<TEntity> GetByIdOrNullInternalAsync(long id)
        {
            return await GetAllInternal().ByIdOrNullAsync(id);
        }

        public virtual async Task<TEntity> GetByIdOrFailAsync(long id)
        {
            return await GetByIdOrFailInternalAsync(id);
        }

        protected async Task<TEntity> GetByIdOrFailInternalAsync(long id)
        {
            return await GetByIdOrNullInternalAsync(id) ?? throw ResourceNotFoundException.CreateFromEntity<TEntity>(id);
        }

        public virtual async Task<long> InsertAsync(TEntity entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfInvalid();

            EntityEntry<TEntity> entry = await Context.Set<TEntity>().AddAsync(entity);
            await Context.SaveChangesAsync();

            return entry.Entity.Id;
        }

        public virtual async Task UpdateAsync(TEntity entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfInvalid();

            Context.AttachIfNecessary(entity);

            await Context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(long id)
        {
            var entity = await GetByIdOrFailInternalAsync(id);
            Context.Set<TEntity>().Remove(entity);

            await Context.SaveChangesAsync();
        }

        public async Task<TResult> DoWithinTransactionAsync<TResult>(Func<Task<TResult>> action, string errorMessage = null)
        {
            action.ThrowIfNull(nameof(action));

            try
            {
                await Context.Database.BeginTransactionAsync();

                TResult result = await action();

                await Context.Database.CommitTransactionAsync();

                return result;
            }
            catch (Exception exception)
            {
                await Context.Database.RollbackTransactionAsync();
                const string defaultError = "Cannot execute transaction due to database error";
                throw new InvalidOperationException(errorMessage ?? defaultError, exception);
            }
        }

        public async Task<bool> HasEntityAsync(long id)
        {
            return await Context.Set<TEntity>().AnyAsync(x => x.Id == id);
        }
    }
}
