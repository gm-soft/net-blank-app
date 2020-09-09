using System;
using System.Linq;

namespace Utils.Dates
{
    /// <summary>
    /// Represents class that contains a collection of bounded <see cref="DayRange"/>
    /// which belong to the same month of the same year.
    /// </summary>
    public class MonthRange : TimeRange
    {
        /// <summary>
        /// Gets month as int.
        /// </summary>
        public int Month { get; }

        /// <summary>
        /// Gets year as int.
        /// </summary>
        public int Year { get; }

        public int DaysCount { get; }

        public MonthRange(int year, int month)
            : base(new Date(year, month, 1), new Date(year, month, DateTime.DaysInMonth(year, month)))
        {
            if (month < 1 || month > 12)
            {
                throw new ArgumentException("Passed month is not a valid value", paramName: nameof(month));
            }

            Year = year;
            Month = month;
            DaysCount = DateTime.DaysInMonth(year, month);
        }

        public MonthRange(Date @from, Date to)
            : base(@from, to)
        {
            if (!SameMonth())
            {
                throw new ArgumentException("Passed dates should belong to the same month");
            }

            Year = @from.Year;
            Month = @from.Month;
            DaysCount = @to.Day - @from.Day + 1;
        }

        public MonthRange(DateTimeOffset @from, DateTimeOffset to)
            : this(new Date(@from), new Date(to))
        {
        }

        public int WorkDaysCount()
        {
            return SplitByDays().Count(x => !x.Weekend());
        }
    }
}