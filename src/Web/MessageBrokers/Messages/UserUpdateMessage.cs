using Newtonsoft.Json;
using Utils.Helpers;
using Utils.Interfaces;
using Web.MessageBrokers.Models;

namespace Web.MessageBrokers.Messages
{
    public class UserUpdateMessage
    {
        public const string Queue = "user-update-queue";

        [JsonProperty]
        public UserData User { get; protected set; }

        public UserUpdateMessage()
        {
        }

        public UserUpdateMessage(IHasUserData data)
        {
            data.ThrowIfNull(nameof(data));

            User = new UserData(data);
        }
    }
}