using System.ComponentModel.DataAnnotations;
using Utils.Enums;

namespace PC.Models.Users
{
    public class IdentityRole
    {
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the name for this role.
        /// </summary>
        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        public Role Role { get; set; }
    }
}