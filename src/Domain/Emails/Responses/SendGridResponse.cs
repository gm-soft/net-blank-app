using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using SendGrid;
using Utils.Helpers;

namespace Domain.Emails.Responses
{
    public class SendGridResponse : IEmailResponse
    {
        private readonly Response _response;

        public SendGridResponse(Response response)
        {
            response.ThrowIfNull(nameof(response));
            _response = response;
        }

        public HttpStatusCode StatusCode => _response.StatusCode;

        public HttpContent Body => _response.Body;

        public HttpResponseHeaders Headers => _response.Headers;

        public async Task<Dictionary<string, dynamic>> BodyAsDictionaryAsync()
        {
            return await _response.DeserializeResponseBodyAsync(_response.Body);
        }
    }
}