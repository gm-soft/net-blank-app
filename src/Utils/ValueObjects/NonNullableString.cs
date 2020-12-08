namespace Utils.ValueObjects
{
    public class NonNullableString : NonNullable<string>
    {
        public NonNullableString(string value)
            : base(value)
        {
        }

        public NonNullableString(string value, string paramName)
            : base(value, paramName)
        {
        }

        public static explicit operator string(NonNullableString nnString)
        {
            return nnString.Value();
        }
    }
}