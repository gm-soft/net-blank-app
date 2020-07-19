using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PC.Database.Models.Users;

namespace PC.Database.Config.Users
{
    public class DbUserConfiguration : IEntityTypeConfiguration<DbUser>
    {
        public void Configure(EntityTypeBuilder<DbUser> builder)
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