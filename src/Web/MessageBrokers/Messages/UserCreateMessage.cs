using Newtonsoft.Json;
using Utils.Helpers;
using Utils.Interfaces;
using Web.MessageBrokers.Models;

namespace Web.MessageBrokers.Messages
{
    public class UserCreateMessage
    {
        public const string Queue = "user-create-queue";

        [JsonProperty]
        public UserData User { get; protected set; }

        public UserCreateMessage()
        {
        }

        public UserCreateMessage(IHasUserData data)
        {
            data.ThrowIfNull(nameof(data));

            User = new UserData(data);
        }
    }
}