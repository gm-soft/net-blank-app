using Newtonsoft.Json;

namespace Web.MessageBrokers.Messages
{
    public class UserRemoveMessage
    {
        public const string Queue = "user-delete-queue";

        [JsonProperty]
        public string UserName { get; protected set; }

        public UserRemoveMessage()
        {
        }

        public UserRemoveMessage(string userName)
        {
            UserName = userName;
        }
    }
}