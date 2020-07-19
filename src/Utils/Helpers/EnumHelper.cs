using System;

namespace Utils.Helpers
{
    public static class EnumHelper
    {
        public static TEnum ToEnum<TEnum>(this string value, TEnum defaultValue = default(TEnum))
            where TEnum : struct
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            value = value.Trim();

            return Enum.TryParse<TEnum>(value, true, out TEnum result)
                ? result :
                defaultValue;
        }
    }
}