using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PC.Models.Users;

namespace PC.Database.Config.Users
{
    public class IdentityUserRoleConfig : IEntityTypeConfiguration<IdentityUserRole>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole> builder)
        {
            builder
                .HasOne(x => x.User)
                .WithMany(x => x.Roles)
                .HasForeignKey(x => x.UserId);

            builder
                .HasOne(x => x.Role)
                .WithMany()
                .HasForeignKey(x => x.RoleId);

            // Copied from IdentityDbContext source code.
            builder
                .HasKey(r => new { r.UserId, r.RoleId });

            builder
                .ToTable("UserRoles");
        }
    }
}