using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PC.Models.Users;
using Utils.Enums;

namespace PC.Database.Config.Users
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        private static IdentityRole CreateRole(Role role)
        {
            var roleAsString = role.ToString();
            return new IdentityRole
            {
                Id = (long)role,
                Name = roleAsString,
                Role = role
            };
        }

        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder
                .HasIndex(r => r.Name)
                .IsUnique();

            builder
                .ToTable("Roles");

            builder
                .HasMany<IdentityUserRole>()
                .WithOne()
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.HasData(
                CreateRole(Role.Partner),
                CreateRole(Role.Employee),
                CreateRole(Role.HRManager),
                CreateRole(Role.TopManager),
                CreateRole(Role.SystemAdministrator),
                CreateRole(Role.System));
        }
    }
}