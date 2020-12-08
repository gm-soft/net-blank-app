using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Utils.ValueObjects;

namespace Web.Configurations
{
    public class ElasticSearchConfig
    {
        private NonNullable<string> _connectionString;

        private NonNullable<string> _appName;

        public string AppName
        {
            get
            {
                if (_appName == null)
                {
                    _appName = new NonNullable<string>(
                        Configuration.GetSection("ElasticSearch")?["AppName"]);
                }

                return _appName.Value();
            }
        }

        public string ConnectionString
        {
            get
            {
                if (_connectionString == null)
                {
                    _connectionString = new NonNullable<string>(
                        Configuration.GetSection("ElasticSearch")?["ConnectionString"]);
                }

                return _connectionString.Value();
            }
        }

        public Uri ConnectionUri => new Uri(ConnectionString);

        public string Environment { get; }

        public IConfiguration Configuration { get; }

        public ElasticSearchConfig(IConfiguration configuration, IHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment.EnvironmentName;
        }
    }
}