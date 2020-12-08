using Utils.MathHelpers;

namespace Utils.Attributes
{
    public class TenPercentMinRateAttribute : PercentsAttribute
    {
        public TenPercentMinRateAttribute()
            : base(Percent.Ten)
        {
        }
    }
}