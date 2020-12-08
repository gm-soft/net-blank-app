using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using User = IdentityServer.Database.Models.User;

namespace IdentityServer.Database.Config
{
    internal class UserConfiguration : IEntityTypeConfiguration<Models.User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .HasIndex(x => x.UserName)
                .IsUnique(true);

            builder
                .HasIndex(x => x.Email)
                .IsUnique(true);
        }
    }
}