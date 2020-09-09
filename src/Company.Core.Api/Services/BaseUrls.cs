using Microsoft.Extensions.Configuration;
using Utils.Interfaces;
using Utils.ValueObjects;

namespace Company.Core.Api.Services
{
    public class BaseUrls : IBaseUrls
    {
        private readonly NonNullable<string> _baseUrl;
        private readonly NonNullable<string> _imageBaseUrl;

        public BaseUrls(IConfiguration config)
        {
            _baseUrl = new NonNullable<string>(value: config["BaseUrl"], paramName: "config.BaseUrl");
            _imageBaseUrl = new NonNullable<string>(value: config["ImageBaseUrl"], paramName: "config.ImageBaseUrl");
        }

        public string BaseUrl => _baseUrl.Value();

        public string ImageBaseUrl => _imageBaseUrl.Value();
    }
}