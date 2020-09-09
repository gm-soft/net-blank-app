using Utils.Interfaces;

namespace TestUtils.ServiceStubs
{
    public class BaseUrlsStub : IBaseUrls
    {
        public string BaseUrl => "https://example.com";

        public string ImageBaseUrl => "https://example.com";
    }
}