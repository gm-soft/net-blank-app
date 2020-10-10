using Microsoft.Extensions.Configuration;
using Utils.ValueObjects;

namespace PC.Domain.Configurations
{
    public class WriteToFilesConfig
    {
        private readonly Bool _value;

        public WriteToFilesConfig(IConfiguration configuration)
        {
            _value = new Bool(configuration.GetSection("Serilog")?["WriteToFileAllowed"]);
        }

        public bool Value() => _value.Value();
    }
}