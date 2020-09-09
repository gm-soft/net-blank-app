using System;

namespace Utils.Exceptions
{
    /// <summary>
    /// Bad Request exception. Means that the client has sent the invalid request.
    /// </summary>
    public class BadAssException : InvalidOperationException
    {
        public BadAssException()
            : base("Bad Request")
        {
        }

        public BadAssException(string message)
            : base(message)
        {
        }

        public BadAssException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}