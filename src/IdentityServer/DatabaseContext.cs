using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Utils.Interfaces;
using RoleConfiguration = IdentityServer.Database.Config.RoleConfiguration;
using UserConfiguration = IdentityServer.Database.Config.UserConfiguration;

namespace IdentityServer
{
    public class DatabaseContext : IdentityDbContext<Database.Models.User, Database.Models.IdentityRole, long>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
               : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            OnBeforeSaving();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        protected virtual void OnBeforeSaving()
        {
            var entries = ChangeTracker.Entries<IBaseModel>();
            var currentDateTime = DateTimeOffset.Now;

            foreach (EntityEntry<IBaseModel> entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = currentDateTime;
                        break;

                    case EntityState.Added:
                        entry.Entity.CreatedAt = currentDateTime;
                        entry.Entity.UpdatedAt = currentDateTime;
                        break;
                }
            }
        }
    }
}