using System;

namespace Web.MessageBrokers.Exceptions
{
    public class CannotConsumeMessageException<TMessage> : InvalidOperationException
        where TMessage : class
    {
        public CannotConsumeMessageException(Exception innerException)
            : base($"Cannot consume {typeof(TMessage).Name} due to internal error", innerException)
        {
        }
    }
}