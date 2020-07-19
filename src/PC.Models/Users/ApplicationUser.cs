using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using Utils.Authorization;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;

namespace PC.Models.Users
{
    public class ApplicationUser : BaseModel, IHasDeletedAt
    {
        public ApplicationUser()
        {
        }

        public ApplicationUser(ClaimsPrincipal claims)
        {
            claims.ThrowIfNull(nameof(claims));

            if (!claims.Claims.Any())
            {
                throw new InvalidOperationException("Cannot create user from empty claims");
            }

            claims.Identity.ThrowIfNull("claims.Identity");

            FirstName = claims.GetClaimValue(ClaimTypes.GivenName);
            LastName = claims.GetClaimValue(ClaimTypes.Surname);
            Email = claims.GetClaimValue(ClaimTypes.Email);
            UserName = claims.GetClaimValue(CustomClaimTypes.Username);
            Role = claims.GetClaimValue(ClaimTypes.Role).ToEnum<Role>();
        }

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
