using System;

namespace Utils.Exceptions
{
    public class BadRequestException : InvalidOperationException
    {
        public BadRequestException()
            : base("BadRequest")
        {
        }

        public BadRequestException(string message)
            : base(message)
        {
        }

        public BadRequestException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}