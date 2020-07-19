using System;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Core;

namespace PC.BL.Logging
{
    public class FileLoggerBuilder
    {
        private const string MessageTemplate = "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}";

        private readonly IConfiguration _configuration;

        private Logger _logger;

        private Exception _exception;

        public FileLoggerBuilder(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Logger Logger()
        {
            if (!Created())
            {
                throw new InvalidOperationException("You have to create the Logger first");
            }

            return _logger;
        }

        public Exception ThrownException()
        {
            if (_exception == null)
            {
                throw new InvalidOperationException("You have to try to initiate the Logger first");
            }

            return _exception;
        }

        public FileLoggerBuilder CreateLogger()
        {
            try
            {
                var loggerConfiguration = new LoggerConfiguration()
                    .ReadFrom.Configuration(_configuration)
                    .WriteTo.Debug()
                    .WriteTo.Console();

                if (_configuration.GetSection("Serilog")["WriteToFileAllowed"] != null)
                {
                    // TODO Maxim: write to a file only when necessary config value exists.
                    loggerConfiguration = loggerConfiguration.WriteTo.File(
                        "../logs/log.txt",
                        rollingInterval: RollingInterval.Day,
                        shared: true,
                        outputTemplate: MessageTemplate);
                }

                _logger = loggerConfiguration.CreateLogger();
            }
            catch (Exception exception)
            {
                _exception = exception;
            }

            return this;
        }

        public bool Created() => _logger != null;
    }
}