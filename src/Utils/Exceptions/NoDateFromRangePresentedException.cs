using System;

namespace Utils.Exceptions
{
    public class NoDateFromRangePresentedException : InvalidOperationException
    {
        public NoDateFromRangePresentedException(string message)
            : base(message)
        {
        }

        public NoDateFromRangePresentedException()
            : this("To date is null")
        {
        }
    }
}