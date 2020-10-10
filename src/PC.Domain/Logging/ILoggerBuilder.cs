using System;
using Serilog.Core;

namespace PC.Domain.Logging
{
    public interface ILoggerBuilder
    {
        Exception ThrownException();

        ILoggerBuilder TryCreateLogger();

        bool Created();

        Logger Logger();
    }
}