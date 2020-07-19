using System;

namespace Utils.Dates
{
    /// <summary>
    /// Represents Time Range between start and end of the one single day.
    /// </summary>
    public class DayRange : TimeRange
    {
        /// <summary>
        /// Gets month that the day belongs to.
        /// </summary>
        public int Month => _source.Source.Month;

        /// <summary>
        /// Gets year that the day belongs to.
        /// </summary>
        public int Year => _source.Source.Year;

        /// <summary>
        /// Gets day itself as int value.
        /// </summary>
        public int Day => _source.Source.Day;

        private readonly DateTimeOffsetExtended _source;

        public DayRange(DateTimeOffsetExtended source)
            : base(source.StartOfTheDay(), source.EndOfTheDay())
        {
            _source = source;
        }

        /// <summary>
        /// Returns true if the day is weekend.
        /// </summary>
        /// <returns>True if weekend.</returns>
        public bool Weekend() => _source.Source.DayOfWeek == DayOfWeek.Saturday ||
                                 _source.Source.DayOfWeek == DayOfWeek.Sunday;
    }
}