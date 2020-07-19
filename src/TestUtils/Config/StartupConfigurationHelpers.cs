using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace TestUtils.Config
{
    public static class StartupConfigurationHelpers
    {
        public static IConfigurationRoot CreateConfigRoot(IDictionary<string, string> values)
        {
            return new ConfigurationBuilder()
                .AddInMemoryCollection(values)
                .Build();
        }
    }
}