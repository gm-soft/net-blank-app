using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Utils.Helpers;
using Utils.Interfaces;
using Web.MessageBrokers.Models;

namespace Web.MessageBrokers.Messages
{
    public class UsersImportMessage
    {
        public const string Queue = "users-import-queue";

        [JsonProperty]
        public IReadOnlyCollection<UserData> Users { get; protected set; }

        public UsersImportMessage()
        {
        }

        public UsersImportMessage(IReadOnlyCollection<IHasUserData> users)
        {
            users.ThrowIfNullOrEmpty(nameof(users));
            Users = users.Select(x => new UserData(x)).ToArray();
        }
    }
}