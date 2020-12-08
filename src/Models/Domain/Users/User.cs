using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using PC.Models.BaseModels;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;
using Utils.Interfaces;

namespace PC.Models.Users
{
    public class User : BaseModel, IHasDeletedAt, IHasUserData
    {
        protected User()
        {
        }

        public User(
            long identityId,
            string firstName,
            string lastName,
            string userName,
            Role role,
            bool emailConfirmed)
            : this(
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                role: role,
                emailConfirmed: emailConfirmed)
        {
            IdentityId = identityId;
        }

        public User(
            string firstName,
            string lastName,
            string userName,
            Role role,
            bool emailConfirmed = false)
        {
            firstName.ThrowIfNullOrEmpty(nameof(firstName));
            lastName.ThrowIfNullOrEmpty(nameof(lastName));
            userName.ThrowIfNullOrEmpty(nameof(userName));

            FirstName = firstName;
            LastName = lastName;
            UserName = userName;
            Email = userName;
            EmailConfirmed = emailConfirmed;

            Roles = new List<IdentityUserRole>();

            ChangeRoleIfNecessary(role);
        }

        /// <summary>
        /// Gets or sets the Identity Id. This Id is SSO identifier and may be not equal to User Id.
        /// </summary>
        [Range(1, long.MaxValue)]
        public long? IdentityId { get; set; }

        [Required]
        [StringLength(256)]
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the email address for this user.
        /// </summary>
        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether a flag indicating if a user has confirmed their email address.
        /// </summary>
        /// <value>True if the email address has been confirmed, otherwise false.</value>
        public bool EmailConfirmed { get; set; }

        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string LastName { get; set; }

        [JsonIgnore]
        public virtual ICollection<IdentityUserRole> Roles { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public bool Active() => DeletedAt == null;

        [NotMapped]
        public Role Role
        {
            get
            {
                IdentityUserRole role = Roles?.FirstOrDefault();
                return role != null ? (Role)role : Role.None;
            }
        }

        public bool HasRole(Role roleToCheck)
        {
            return Roles?.Any(x => (Role)x >= roleToCheck) ?? false;
        }

        public void HasRoleOrFail(Role role)
        {
            if (!HasRole(role))
            {
                throw new NoPermissionsException("You have no permission to execute this operation");
            }
        }

        public override string ToString()
        {
            return $"User:{Id} {UserName}. Role {Role}";
        }

        public string Fullname()
        {
            return $"{FirstName} {LastName}";
        }

        public void Update(string firstName, string lastName, string phone)
        {
            FirstName = firstName;
            LastName = lastName;
            PhoneNumber = phone;
        }

        public void Update(
            string firstName, string lastName, string phone, Role role)
        {
            Update(
                firstName: firstName,
                lastName: lastName,
                phone: phone);

            ChangeRoleIfNecessary(role);
        }

        public void ChangeRoleIfNecessary(Role role)
        {
            Roles ??= new List<IdentityUserRole>();

            if (Roles.Any() && Role == role)
            {
                return;
            }

            Roles.Clear();
            Roles.Add(new IdentityUserRole(Id, role));
        }

        public void CouldBeUpdatedOrFail(User currentUser, Role roleToSet)
        {
            if (Role == roleToSet)
            {
                return;
            }

            if (!currentUser.HasRole(Role.HRManager))
            {
                throw new NoPermissionsException("You are not able to edit roles of other users");
            }

            if (currentUser.Id == Id)
            {
                throw new BadAssException("You cannot edit your own role");
            }

            if (currentUser.Role < Role)
            {
                throw new NoPermissionsException("You cannot edit roles of users with the role above your own");
            }

            if (currentUser.Role < roleToSet)
            {
                throw new BadAssException("You cannot set the role above your own");
            }
        }
    }
}