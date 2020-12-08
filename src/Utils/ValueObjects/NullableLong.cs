namespace Utils.ValueObjects
{
    public class NullableLong
    {
        private readonly string _source;

        private bool _gotValue;
        private long? _value;

        /// <summary>
        /// Null is not allowed.
        /// </summary>
        /// <param name="source">Source.</param>
        public NullableLong(string source)
        {
            _source = source;
        }

        public long? Value()
        {
            if (_value == null && !_gotValue)
            {
                if (_source != null && long.TryParse(_source, out var result))
                {
                    _value = result;
                }
                else
                {
                    _gotValue = true;
                    _value = null;
                }
            }

            return _value;
        }

        public bool Equals(long second) => second == Value();
    }
}