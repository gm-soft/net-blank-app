using System;

namespace Utils.Exceptions
{
    public class NoPermissionsException : Exception
    {
        public NoPermissionsException()
            : this("You do not have permission to execute this operation")
        {
        }

        public NoPermissionsException(string message)
            : base(message)
        {
        }
    }
}