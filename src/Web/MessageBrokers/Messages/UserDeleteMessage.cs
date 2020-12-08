using Newtonsoft.Json;

namespace Web.MessageBrokers.Messages
{
    public class UserDeleteMessage
    {
        public const string Queue = "user-delete-queue";

        [JsonProperty]
        public string UserName { get; protected set; }

        public UserDeleteMessage()
        {
        }

        public UserDeleteMessage(string userName)
        {
            UserName = userName;
        }
    }
}