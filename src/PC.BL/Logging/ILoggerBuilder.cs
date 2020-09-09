using System;
using Serilog.Core;

namespace PC.BL.Logging
{
    public interface ILoggerBuilder
    {
        Exception ThrownException();

        ILoggerBuilder TryCreateLogger();

        bool Created();

        Logger Logger();
    }
}