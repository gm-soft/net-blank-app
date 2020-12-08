using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Emails.Responses
{
    public class LocalEmailResponse : IEmailResponse
    {
        public HttpStatusCode StatusCode => HttpStatusCode.OK;

        public HttpContent Body => new FakeHttpContent();

        public HttpResponseHeaders Headers => new HttpResponseMessage().Headers;

        public Task<Dictionary<string, dynamic>> BodyAsDictionaryAsync()
        {
            return Task.FromResult(new Dictionary<string, dynamic>());
        }

        // https://www.nocture.dk/2013/05/21/csharp-unit-testing-classes-with-httpclient-dependence-using-autofixture/
        private class FakeHttpContent : HttpContent
        {
            protected override async Task SerializeToStreamAsync(Stream stream, TransportContext context)
            {
                byte[] byteArray = Encoding.ASCII.GetBytes(string.Empty);
                await stream.WriteAsync(byteArray, 0, 0);
            }

            protected override bool TryComputeLength(out long length)
            {
                length = 0;
                return true;
            }
        }
    }
}