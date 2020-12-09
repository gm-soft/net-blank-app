using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Utils.Helpers;
using Utils.Interfaces;
using Web.MessageBrokers.Models;

namespace Web.MessageBrokers.Messages
{
    public class UserChangeMessage
    {
        public const string Queue = "user-change-queue";

        [JsonProperty]
        public IReadOnlyCollection<UserData> Users { get; protected set; }

        [JsonProperty]
        public ChangeType ChangeType { get; protected set; }

        public UserChangeMessage()
        {
        }

        public UserChangeMessage(IHasUserData user, ChangeType type)
            : this(new[] { user }, type)
        {
        }

        public UserChangeMessage(IEnumerable<IHasUserData> users, ChangeType type)
        {
            users.ThrowIfNull(nameof(users));

            Users = users.Select(x => new UserData(x)).ToArray();
            ChangeType = type;
        }

        public UserData User()
        {
            if (Users.Count > 1)
            {
                throw new InvalidOperationException($"There are {Users.Count} users in the message");
            }

            return Users.FirstOrDefault();
        }
    }
}