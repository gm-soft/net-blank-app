using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PC.Database.Config.Users;
using PC.Models.Users;
using Utils.Interfaces;

namespace Database
{
    public class DatabaseContext : DbContext
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
            builder.ApplyConfiguration(new IdentityUserRoleConfig());
        }

        /// <summary>
        /// Gets or sets the <see cref="IdentityUserRole"/> of User roles.
        /// </summary>
        public virtual DbSet<IdentityUserRole> UserRoles { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="IdentityRole"/> of roles.
        /// </summary>
        public virtual DbSet<IdentityRole> Roles { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="User"/> of Users.
        /// </summary>
        public virtual DbSet<User> Users { get; set; }

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