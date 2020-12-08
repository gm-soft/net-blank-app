using System;
using Serilog.Core;

namespace Web.Logging
{
    public interface ILoggerBuilder
    {
        Exception ThrownException();

        ILoggerBuilder TryCreateLogger();

        bool Created();

        Logger Logger();
    }
}