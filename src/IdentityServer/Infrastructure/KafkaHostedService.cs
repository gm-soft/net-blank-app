using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Web.MessageBrokers.Kafka;

namespace IdentityServer.Infrastructure
{
    public class KafkaHostedService : IHostedService
    {
        private readonly ILogger<KafkaHostedService> _logger;

        private readonly AppKafkaOptions _configOptions;

        private readonly IReadOnlyCollection<IKafkaConsumer> _consumers;

        private bool _cancelled;

        public KafkaHostedService(
            IEnumerable<IKafkaConsumer> consumers,
            ILogger<KafkaHostedService> logger,
            AppKafkaOptions configOptions)
        {
            _consumers = consumers.ToArray();
            _logger = logger;
            _configOptions = configOptions;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            var tasks = _consumers
                .Select(x =>
                {
                    _logger.LogInformation($"Consumer for topic: {x.Topic} registered");
                    return Task.Run(() => ConsumeInternalAsync(x, cancellationToken), cancellationToken);
                })
                .ToArray();

            await Task.WhenAll(tasks);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _cancelled = cancellationToken.IsCancellationRequested;
            return Task.CompletedTask;
        }

        private async Task ConsumeInternalAsync(IKafkaConsumer kafkaConsumer, CancellationToken cancellationToken)
        {
            var builder = new ConsumerBuilder<string, string>(_configOptions.ConsumerConfig());

            using IConsumer<string, string> consumer = builder.Build();

            try
            {
                consumer.Subscribe(kafkaConsumer.Topic);

                try
                {
                    while (!_cancelled && !cancellationToken.IsCancellationRequested)
                    {
                        ConsumeResult<string, string> consumed = consumer.Consume(cancellationToken);

                        _logger.LogInformation($"{kafkaConsumer.GetType().Name}: consumed");

                        await kafkaConsumer.ConsumeAsync(consumed.Message.Value);
                    }
                }
                catch (ConsumeException e)
                {
                    _logger.LogError(e, kafkaConsumer.Topic +
                                        $"\r\nAn exception during consuming\r\n" +
                                        $"Reason: {e.Error.Reason}\r\n" +
                                        $"Consumer is being closed");
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(
                    exception,
                    $"Topic: {kafkaConsumer.Topic}\r\n" +
                    $"An exception during consuming\r\n");
            }
            finally
            {
                _logger.LogInformation($"{kafkaConsumer.Topic}. Consumer is being closed");
                consumer.Close();
            }
        }
    }
}