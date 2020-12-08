using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PC.Models.Users;

namespace PC.Database.Config.Users
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .HasIndex(x => x.UserName)
                .IsUnique(true);

            builder
                .HasIndex(x => x.Email)
                .IsUnique(true);

            builder
                .HasIndex(x => x.IdentityId)
                .IsUnique(true);

            builder
                .ToTable("Users");

            builder
                .HasMany<IdentityUserRole>()
                .WithOne()
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
        }
    }
}