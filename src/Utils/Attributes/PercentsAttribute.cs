using System;
using System.ComponentModel.DataAnnotations;
using Utils.MathHelpers;

namespace Utils.Attributes
{
    public class PercentsAttribute : RangeAttribute
    {
        public PercentsAttribute(int minimum = 0)
            : base(minimum, Percent.Hundred)
        {
            if (minimum < 0)
            {
                throw new ArgumentException(message: "The MIN should not be negative digit", paramName: nameof(minimum));
            }
        }
    }
}