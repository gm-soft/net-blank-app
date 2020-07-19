using System;
using System.Collections.Generic;
using System.Linq;

namespace Utils.Helpers
{
    public static class ValidateUtilities
    {
        public static void ThrowIfNull<T>(this T instance, string paramName, string customErrorMessage = null)
        {
            if (string.IsNullOrEmpty(paramName))
            {
                throw new InvalidOperationException("You should not pass null or empty string a paramName");
            }

            if (instance != null)
            {
                return;
            }

            var exception = customErrorMessage == null
                ? new ArgumentNullException(paramName: paramName)
                : new ArgumentNullException(paramName: paramName, message: customErrorMessage);

            throw exception;
        }

        public static IReadOnlyCollection<T> ThrowIfNullOrEmpty<T>(this IReadOnlyCollection<T> collection, string paramName)
            where T : class
        {
            paramName.ThrowIfNullOrEmpty(nameof(paramName));

            if (collection == null)
            {
                throw new ArgumentNullException(paramName: paramName);
            }

            if (!collection.Any())
            {
                throw new InvalidOperationException($"You should not pass empty collection: {paramName}");
            }

            return collection;
        }

        public static bool NullOrEmpty(this string @string)
        {
            return string.IsNullOrEmpty(@string?.Trim());
        }

        public static void ThrowIfNullOrEmpty(this string @string, string paramName)
        {
            if (string.IsNullOrEmpty(paramName))
            {
                throw new InvalidOperationException("You should not pass null or empty string a paramName");
            }

            if (string.IsNullOrEmpty(@string?.Trim()))
            {
                throw new ArgumentNullException(paramName: paramName);
            }
        }

        public static bool IsDefaultValue(this double @double)
        {
            return Math.Abs(@double - default(double)) < 0.01;
        }
    }
}