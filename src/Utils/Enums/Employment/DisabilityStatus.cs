using System;

namespace Utils.Enums.Employment
{
    [Flags]
    public enum DisabilityStatus
    {
        /// <summary>
        /// Нет инвалидности
        /// </summary>
        NoStatus = 1,

        /// <summary>
        /// Инвалид 1, 2, 3 группы со сроком.
        /// </summary>
        HasStatusWithLimit = 2,

        /// <summary>
        /// Инвалид 1, 2, 3 группы бессрочно.
        /// </summary>
        HasStatusNoLimited = 4,

        All = NoStatus | HasStatusWithLimit | HasStatusNoLimited
    }
}