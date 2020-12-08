using System;
using System.Collections.Generic;
using System.Linq;
using PC.Models.Users;
using TestUtils.Mappings;
using Utils.Enums;

namespace TestUtils.EntityFactories
{
    public class FakeUser : User
    {
        public FakeUser(Role role)
            : this(
                role: role,
                userName: null,
                firstName: null,
                lastName: null)
        {
        }

        public FakeUser(
            Role role,
            string userName = null,
            string firstName = null,
            string lastName = null)
        {
            Id = new Random((int)DateTimeOffset.Now.Ticks).Next(0, int.MaxValue);
            FirstName = firstName ?? Faker.Name.First();
            LastName = lastName ?? Faker.Name.Last();

            userName ??= $"{FirstName.First()}.{LastName}@example.com".ToLowerInvariant() + DateTimeOffset.Now.Ticks;

            UserName = userName;
            Email = userName;
            Roles = new List<IdentityUserRole>();

            ChangeRoleIfNecessary(role);
        }

        public User Please()
        {
            AutomapperSingleton.Initialize();
            return AutomapperSingleton.Map<User>(this);
        }
    }
}