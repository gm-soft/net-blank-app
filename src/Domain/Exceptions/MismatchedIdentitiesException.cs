using System;
using PC.Models.Records.Users;
using PC.Models.Users;

namespace Domain.Exceptions
{
    public class MismatchedIdentitiesException : InvalidOperationException
    {
        public MismatchedIdentitiesException(User user, IdentityUser identityUser)
            : base($"User.Id:{user.Id} has mismatched identities.\r\n" +
                   $"API.IdentityId:{user.IdentityId}\r\n" +
                   $"IS.IdentityId:{identityUser.Id}")
        {
        }
    }
}