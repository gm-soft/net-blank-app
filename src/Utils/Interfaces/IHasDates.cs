using System;

namespace Utils.Interfaces
{
    public interface IHasDates
    {
        DateTimeOffset CreatedAt { get; set; }

        DateTimeOffset UpdatedAt { get; set; }
    }
}