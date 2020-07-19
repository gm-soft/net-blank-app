using System;
using Utils.Interfaces;

namespace PC.Database.Models.BaseModels
{
    public abstract class DbBaseModel : IBaseModel
    {
        public long Id { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }
    }
}