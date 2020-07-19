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

        /// <summary>
        /// Returns true if a model entity is valid by it's annotation validation attributes.
        /// </summary>
        /// <typeparam name="T">Generic.</typeparam>
        /// <param name="entity">Entity instance.</param>
        /// <returns>True if the entity is valid.</returns>
        public static bool Valid<T>(this T entity)
        {
            return new EntityValidator<T>(entity).Valid();
        }

        public static void ThrowIfDateRangeIsNotValid<T>(this T instance)
            where T : IHasTimeRange
        {
            if (instance.From.Earlier(TimeRange.Min))
            {
                throw new InvalidOperationException("A From Date of the Project should not be equal to MinValue");
            }

            if (!instance.To.HasValue)
            {
                throw new ArgumentNullException(nameof(instance.To), "A To Date of the Project should not be null");
            }

            if (instance.From.Later(instance.To.Value))
            {
                throw new InvalidOperationException("To date cannot be greater than From date");
            }
        }
    }
}