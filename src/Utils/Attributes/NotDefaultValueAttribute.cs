using System;
using System.ComponentModel.DataAnnotations;

namespace Utils.Attributes
{
    /// <summary>
    /// Checks that the property contains not-default value. Returns true if the property is not value type of.
    /// </summary>
    public class NotDefaultValueAttribute : ValidationAttribute
    {
        public const string DefaultErrorMessage = "The {0} field must not have the default value";

        public NotDefaultValueAttribute()
            : base(DefaultErrorMessage)
        {
        }

        // Copied from https://andrewlock.net/creating-an-empty-guid-validation-attribute/
        public override bool IsValid(object value)
        {
            // NotDefaultValue doesn't necessarily mean required
            if (value == null)
            {
                return true;
            }

            var type = value.GetType();
            if (type.IsValueType)
            {
                var defaultValue = Activator.CreateInstance(type);
                return !value.Equals(defaultValue);
            }

            // non-null ref type
            return true;
        }
    }
}