using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;

namespace IdentityServer.Database.Models
{
    public class User : IdentityUser<long>, IBaseModel, IHasDeletedAt
    {
        /// <summary>
        /// Warning! Do not use in the domain code.
        /// </summary>
        public User()
        {
        }

        public User(
            string firstName,
            string lastName,
            string email,
            Role role,
            bool emailConfirmed = false)
        {
            firstName.ThrowIfNullOrEmpty(nameof(firstName));
            lastName.ThrowIfNullOrEmpty(nameof(lastName));
            email.ThrowIfNullOrEmpty(nameof(email));

            FirstName = firstName;
            LastName = lastName;
            UserName = email;
            Email = email;
            Role = role;
            EmailConfirmed = emailConfirmed;
        }

        public User(IHasUserData data)
        {
            data.ThrowIfNull(nameof(data));

            Id = data.Id;
            UserName = data.UserName;
            Email = data.Email;
            FirstName = data.FirstName;
            LastName = data.LastName;
            Role = data.Role;
        }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string LastName { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool Active() => DeletedAt == null;

        [NotMapped]
        public Role Role { get; set; }

        public override string ToString()
        {
            return $"User:{Id} {UserName}. Role {Role}";
        }

        public void Update(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }
    }
}