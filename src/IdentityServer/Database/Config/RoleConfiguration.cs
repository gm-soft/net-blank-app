using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Utils.Enums;
using IdentityRole = IdentityServer.Database.Models.IdentityRole;

namespace IdentityServer.Database.Config
{
    internal class RoleConfiguration : IEntityTypeConfiguration<Models.IdentityRole>
    {
        private static IdentityRole CreateRole(Role role, string uniqueId)
        {
            var roleAsString = role.ToString();
            return new IdentityRole
            {
                Id = (long)role,
                Name = roleAsString,
                NormalizedName = roleAsString.ToUpper(),
                ConcurrencyStamp = uniqueId,
                Role = role
            };
        }

        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
                CreateRole(Role.Partner, "61e18f26-e0e3-405b-ba25-8974e4d02ecc"),
                CreateRole(Role.Employee, "b84d4fc4-e7ae-4db9-b158-88fa2380bda5"),
                CreateRole(Role.HRManager, "28788134-8fd8-4b31-9130-6cdd8ef567ef"),
                CreateRole(Role.TopManager, "e0987060-5be4-46a4-828a-06b01c94d720"),
                CreateRole(Role.SystemAdministrator, "b7c311ac-f236-45af-8e33-126ee74c67d3"),
                CreateRole(Role.System, "61cb018d-8deb-4bed-9056-206ded62a52d"));
        }
    }
}