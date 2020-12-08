using System;
using Elasticsearch.Net;
using Serilog;
using Serilog.Core;
using Serilog.Formatting.Elasticsearch;
using Serilog.Sinks.Elasticsearch;
using Web.Configurations;

namespace Web.Logging
{
    public class ElkLoggerBuilder : ILoggerBuilder
    {
        private readonly ElasticSearchConfig _config;

        private Logger _logger;

        private ElasticsearchClientException _elkCreateException;

        public ElkLoggerBuilder(ElasticSearchConfig config)
        {
            _config = config;
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

        public ILoggerBuilder TryCreateLogger()
        {
            try
            {
                _logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(_config.Configuration)
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
            return new ElasticsearchSinkOptions(_config.ConnectionUri)
            {
                IndexFormat = $"logstash-{_config.AppName}-{_config.Environment}",
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