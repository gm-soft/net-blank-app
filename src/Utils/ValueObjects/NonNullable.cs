using System;

namespace Utils.ValueObjects
{
    public class NonNullable<T>
        where T : class
    {
        private readonly T _value;

        private readonly string _paramName;

        public NonNullable(T value)
            : this(value, null)
        {
        }

        public NonNullable(T value, string paramName)
        {
            _value = value;
            _paramName = paramName;
        }

        public T Value()
        {
            if (_value == null)
            {
                var message = _paramName != null
                    ? $"The variable '{_paramName}' is null"
                    : "The passed value is null";

                throw new InvalidOperationException(message);
            }

            return _value;
        }
    }
}