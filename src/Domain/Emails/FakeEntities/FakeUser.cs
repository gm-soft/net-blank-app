using PC.Models.Users;
using Utils.Enums;

namespace Domain.Emails.FakeEntities
{
    internal class FakeUser : User
    {
        public FakeUser(string firstName, string lastName, string userName)
            : base(firstName, lastName, userName, Role.Employee, false)
        {
        }
    }
}