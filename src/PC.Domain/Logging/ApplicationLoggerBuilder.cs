using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using PC.Domain.Configurations;
using Serilog.Core;

namespace PC.Domain.Logging
{
    public class ApplicationLoggerBuilder
    {
        private readonly ElkLoggerBuilder _elkLoggerBuilder;

        private readonly FileLoggerBuilder _fileLoggerBuilder;

        private readonly LoggingMessageTemplate _messageTemplate;

        public ApplicationLoggerBuilder(IConfiguration configuration, IHostEnvironment environment)
        {
            _messageTemplate = new LoggingMessageTemplate(configuration);

            _elkLoggerBuilder = new ElkLoggerBuilder(new ElasticSearchConfig(configuration, environment));

            _fileLoggerBuilder = new FileLoggerBuilder(
                messageTemplate: _messageTemplate,
                writeToFiles: new WriteToFilesConfig(configuration),
                configuration: configuration);
        }

        public Logger Logger()
        {
            if (_elkLoggerBuilder.TryCreateLogger().Created())
            {
                return _elkLoggerBuilder.Logger();
            }

            if (!_fileLoggerBuilder.TryCreateLogger().Created())
            {
                throw new InvalidOperationException(
                    "Cannot create file logger", _fileLoggerBuilder.ThrownException());
            }

            Logger logger = _fileLoggerBuilder.Logger();

            logger.Error(
                new InvalidOperationException(
                    "Logging to ELK is not available. Started to log in file",
                    _elkLoggerBuilder.ThrownException()),
                messageTemplate: _messageTemplate.Value());

            return logger;
        }
    }
}