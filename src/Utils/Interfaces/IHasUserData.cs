using Utils.Enums;

namespace Utils.Interfaces
{
    public interface IHasUserData
    {
        long Id { get; }

        string UserName { get; }

        string Email { get; }

        string FirstName { get; }

        string LastName { get; }

        Role Role { get; }
    }
}