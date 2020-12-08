using Newtonsoft.Json;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;

namespace Web.MessageBrokers.Models
{
    public class UserData : IHasUserData
    {
        [JsonProperty]
        public long Id { get; protected set; }

        [JsonProperty]
        public string UserName { get; protected set; }

        [JsonProperty]
        public string Email { get; protected set; }

        [JsonProperty]
        public string FirstName { get; protected set; }

        [JsonProperty]
        public string LastName { get; protected set; }

        [JsonProperty]
        public Role Role { get; protected set; }

        public UserData()
        {
        }

        public UserData(IHasUserData data)
        {
            data.ThrowIfNull(nameof(data));

            Id = data.Id;
            UserName = data.UserName;
            Email = data.Email;
            FirstName = data.FirstName;
            LastName = data.LastName;
            Role = data.Role;
        }
    }
}