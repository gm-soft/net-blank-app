using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Utils.Helpers;
using Utils.Interfaces;

namespace PC.Database.Extensions
{
    public static class DatabaseContextExtensions
    {
        /// <summary>
        /// Determines whether the specified entity key is attached is attached.
        /// </summary>
        /// <typeparam name="T">Entity type.</typeparam>
        /// <param name="context">The context.</param>
        /// <param name="entry">The key.</param>
        public static void AttachIfNecessary<T>(this DatabaseContext context, T entry)
            where T : class, IBaseModel
        {
            context.ThrowIfNull(nameof(context));
            entry.ThrowIfNull(nameof(entry));

            try
            {
                if (context.ChangeTracker.Entries<T>().All(e => e.Entity.Id != entry.Id))
                {
                    context.Attach(entry);
                }
            }
            catch (Exception e)
            {
                throw new InvalidOperationException(
                    $"Not able to attach instance of {typeof(T).Name} Id:{entry.Id}", e);
            }
        }

        public static void Detach<T>(this DatabaseContext context, T entity)
            where T : class
        {
            context.ThrowIfNull(nameof(context));
            entity.ThrowIfNull(nameof(entity));

            context.Entry(entity).State = EntityState.Detached;
        }

        public static void DetachAll(this DatabaseContext context)
        {
            context.ThrowIfNull(nameof(context));
            var entries = context.ChangeTracker.Entries();

            foreach (EntityEntry entity in entries)
            {
                context.Entry(entity.Entity).State = EntityState.Detached;
            }
        }
    }
}