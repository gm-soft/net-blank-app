using System;
using Elasticsearch.Net;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Core;
using Serilog.Formatting.Elasticsearch;
using Serilog.Sinks.Elasticsearch;

namespace PC.BL.Logging
{
    public class ElkLoggerBuilder
    {
        private const string ElkConnectionStringConfigKey = "ElasticSearch";

        private readonly string _elkConnectionString;
        private readonly IConfiguration _configuration;

        private Logger _logger;

        private ElasticsearchClientException _elkCreateException;

        public ElkLoggerBuilder(IConfiguration configuration)
        {
            _configuration = configuration;
            _elkConnectionString = configuration.GetConnectionString(ElkConnectionStringConfigKey);
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
            if (_elkCreateException == null)
            {
                throw new InvalidOperationException("You have to try to initiate the Logger first");
            }

            return _elkCreateException;
        }

        public ElkLoggerBuilder TryCreateLogger()
        {
            try
            {
                _logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(_configuration)
                    .WriteTo.Elasticsearch(ElasticsearchSinkOptions())
                    .WriteTo.Console()
                    .WriteTo.Debug()
                    .CreateLogger();
            }
            catch (ElasticsearchClientException exception)
            {
                _elkCreateException = exception;
            }

            return this;
        }

        public bool Created() => _logger != null;

        private ElasticsearchSinkOptions ElasticsearchSinkOptions()
        {
            return new ElasticsearchSinkOptions(new Uri(_elkConnectionString))
            {
                AutoRegisterTemplate = true,
                OverwriteTemplate = true,
                DetectElasticsearchVersion = true,
                AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv7,
                NumberOfReplicas = 1,
                NumberOfShards = 2,
                CustomFormatter = new ExceptionAsObjectJsonFormatter(renderMessage: true),

                // BufferBaseFilename = "./buffer",
                RegisterTemplateFailure = RegisterTemplateRecovery.FailSink,
                FailureCallback = e => Console.WriteLine("Unable to submit event " + e.MessageTemplate),
                EmitEventFailure = EmitEventFailureHandling.WriteToSelfLog |
                                   EmitEventFailureHandling.WriteToFailureSink |
                                   EmitEventFailureHandling.RaiseCallback,
            };
        }
    }
}