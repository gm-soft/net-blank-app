using System;
using System.ComponentModel.DataAnnotations;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;

namespace Domain.Dtos.Users
{
    public class UserDto : IHasId
    {
        public UserDto()
        {
        }

        public UserDto(string firstName, string lastName, string userName, Role role)
        {
            firstName.ThrowIfNullOrEmpty(nameof(firstName));
            lastName.ThrowIfNullOrEmpty(nameof(lastName));
            userName.ThrowIfNullOrEmpty(nameof(userName));

            FirstName = firstName;
            LastName = lastName;
            UserName = userName;
            Role = role;
        }

        public UserDto(string firstName, string lastName, string userName)
            : this(firstName, lastName, userName, Role.Employee)
        {
        }

        // Only for test purposes
        // TODO Maxim: create derived class for setting ID
        public UserDto(long id, string firstName, string lastName, string userName, Role role)
            : this(firstName, lastName, userName, role)
        {
            Id = id;
        }

        public long Id { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string LastName { get; set; }

        [Required]
        public string UserName { get; set; }

        public string PhoneNumber { get; set; }

        public Role Role { get; set; }

        public bool EmailConfirmed { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public void PurifyData()
        {
            UserName = UserName?.Trim();
            FirstName = FirstName?.Trim();
            LastName = LastName?.Trim();

            UserName.ThrowIfNullOrEmpty(nameof(UserName));
            FirstName.ThrowIfNullOrEmpty(nameof(FirstName));
            LastName.ThrowIfNullOrEmpty(nameof(LastName));
        }
    }
}
