using System;
using Utils.Dates;
using Utils.Helpers;
using Utils.Interfaces;

namespace Utils.Validators
{
    public static class EntityValidatorExtensions
    {
        /// <summary>
        /// Asserts that a model entity is valid by it's annotation validation attributes.
        /// </summary>
        /// <typeparam name="T">Generic.</typeparam>
        /// <param name="entity">Entity instance.</param>
        public static void ThrowIfInvalid<T>(this T entity)
        {
            new EntityValidator<T>(entity).ThrowIfInvalid();
        }

        public static void ThrowIfDateRangeIsOutOfAllowedLimits<T>(this T instance)
            where T : IHasFromToDates
        {
            instance.ThrowIfNull(nameof(instance));

            if (instance.From.Earlier(TimeRange.Min) || instance.From.Later(TimeRange.Max))
            {
                throw new InvalidOperationException(
                    $"{nameof(TimeRange.From)} is not within allowed range");
            }

            if (instance.To.Earlier(TimeRange.Min) || instance.To.Later(TimeRange.Max))
            {
                throw new InvalidOperationException(
                    $"{nameof(TimeRange.To)} is not within allowed range");
            }
        }

        public static void ThrowIfDateRangeIsNotValid<T>(this T instance, bool toIsRequired)
            where T : IHasFromToDates
        {
            if (instance.From.Earlier(TimeRange.Min))
            {
                throw new InvalidOperationException(
                    $"A From Date of the {typeof(T).Name} should not be earlier than MinValue");
            }

            if (toIsRequired && !instance.To.HasValue)
            {
                throw new ArgumentNullException(nameof(instance.To), $"A To Date of the {typeof(T).Name} should not be null");
            }

            if (instance.RangeReversed(toIsRequired))
            {
                throw new InvalidOperationException("To date cannot be greater than From date");
            }

            if (instance.To.HasValue && instance.To.Value.Later(TimeRange.Max))
            {
                throw new InvalidOperationException(
                    $"A To Date of the {typeof(T).Name} should not be later than MaxValue");
            }
        }

        public static bool RangeReversed<T>(this T instance, bool toIsRequired)
            where T : IHasFromToDates
        {
            return (toIsRequired || instance.To.HasValue) && instance.From.Later(instance.ToOrFail());
        }
    }
}