using System;
using System.ComponentModel.DataAnnotations;
using Utils.Enums;
using Utils.Interfaces;

namespace PC.Models.Users
{
    public class ApplicationUser : BaseModel, IHasDeletedAt
    {
        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string LastName { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public bool EmailConfirmed { get; set; }

        public Role Role { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool HasRole(Role roleToCheck)
        {
            return Role >= roleToCheck;
        }

        public override string ToString()
        {
            return $"User:{Id} {UserName}. Role {Role}";
        }
    }
}
