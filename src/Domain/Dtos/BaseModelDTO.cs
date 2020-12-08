using System;
using Utils.Interfaces;

namespace Domain.Dtos
{
    public abstract class BaseModelDto : IBaseModel
    {
        public long Id { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }

        public bool IsNew() => Id == default(long);
    }
}