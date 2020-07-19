using System;
using Microsoft.Extensions.Configuration;
using Serilog.Core;

namespace PC.BL.Logging
{
    public class ApplicationLoggerBuilder
    {
        private const string MessageTemplate = "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}";

        private readonly ElkLoggerBuilder _elkLoggerBuilder;

        private readonly FileLoggerBuilder _fileLoggerBuilder;

        public ApplicationLoggerBuilder(IConfiguration configuration)
        {
            _elkLoggerBuilder = new ElkLoggerBuilder(configuration);
            _fileLoggerBuilder = new FileLoggerBuilder(configuration);
        }

        public Logger Logger()
        {
            if (_elkLoggerBuilder.TryCreateLogger().Created())
            {
                return _elkLoggerBuilder.Logger();
            }

            if (!_fileLoggerBuilder.CreateLogger().Created())
            {
                throw new InvalidOperationException(
                    "Cannot create file logger", _fileLoggerBuilder.ThrownException());
            }

            Logger logger = _fileLoggerBuilder.Logger();

            logger.Error(
                exception: new InvalidOperationException(
                    "Logging to ELK is not available. Started to log in file", _elkLoggerBuilder.ThrownException()),
                messageTemplate: MessageTemplate);

            return logger;
        }
    }
}