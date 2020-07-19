using System;

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

        public MonthRange(DateTimeOffset @from, DateTimeOffset to)
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
    }
}