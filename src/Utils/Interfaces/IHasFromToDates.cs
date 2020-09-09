using System;

namespace Utils.Interfaces
{
    public interface IHasFromToDates
    {
        DateTimeOffset From { get; set; }

        DateTimeOffset? To { get; set; }

        DateTimeOffset ToOrFail();
    }
}