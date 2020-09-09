using Utils.Enums;

namespace Utils.Dates
{
    public interface IHasYearMonth
    {
        Month Month { get; set; }

        int Year { get; set; }
    }
}