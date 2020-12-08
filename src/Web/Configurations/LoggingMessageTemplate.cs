using System;
using Microsoft.Extensions.Configuration;

namespace Web.Configurations
{
    public class LoggingMessageTemplate
    {
        private readonly IConfiguration _configuration;

        private string _value;

        public LoggingMessageTemplate(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Value()
        {
            if (_value == null)
            {
                _value = _configuration.GetSection("Logging")?["MessageTemplate"]
                    ?? throw new InvalidOperationException("No MessageTemplate in configs");
            }

            return _value;
        }
    }
}