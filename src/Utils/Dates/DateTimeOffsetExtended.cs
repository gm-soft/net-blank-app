using System;
using System.Linq;

namespace Utils.Dates
{
    public class DateTimeOffsetExtended
    {
        public static DateTimeOffsetExtended Today => new DateTimeOffsetExtended(new DateTimeOffset(DateTime.Today));

        public static DateTimeOffsetExtended Yesterday =>
            new DateTimeOffsetExtended(new DateTimeOffset(DateTime.Today.AddDays(-1)));

        public static int WorkDaysInMonth(int month, int year)
        {
            int firstDayOfMonth = 1;
            return Enumerable.Range(firstDayOfMonth, DateTime.DaysInMonth(year, month))
                                             .Select(day => new DateTime(year, month, day))
                                             .Count(d => d.DayOfWeek != DayOfWeek.Saturday &&
                                                         d.DayOfWeek != DayOfWeek.Sunday);
        }

        public DateTimeOffset Source { get; }

        public DateTimeOffsetExtended(DateTimeOffset source)
        {
            Source = source;
        }

        public DateTimeOffsetExtended(int year, int month, int day)
            : this(new DateTimeOffset(new DateTime(year, month, day)))
        {
        }

        public DateTimeOffsetExtended AddDays(int days)
        {
            return new DateTimeOffsetExtended(Source.AddDays(days));
        }

        // TODO Maxim: unittests
        public bool IsFirstDayOfMonth()
        {
            return Source.Day == 1;
        }

        // TODO Maxim: unittests
        public bool IsLastDayOfMonth()
        {
            return Source.Day == DateTime.DaysInMonth(Source.Year, Source.Month);
        }

        public DateTimeOffset FirstDayOfMonth()
        {
            return new DateTimeOffset(
                new DateTime(
                    year: Source.Year,
                    month: Source.Month,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0),
                Source.Offset);
        }

        public DateTimeOffset StartOfTheDay()
        {
            return new DateTimeOffset(
                year: Source.Year,
                month: Source.Month,
                day: Source.Day,
                hour: 0,
                minute: 0,
                second: 0,
                offset: Source.Offset);
        }

        public DateTimeOffset EndOfTheDay()
        {
            return new DateTimeOffset(
                year: Source.Year,
                month: Source.Month,
                day: Source.Day,
                hour: 23,
                minute: 59,
                second: 59,
                offset: Source.Offset);
        }

        public DateTimeOffset LastDayOfMonth()
        {
            return new DateTimeOffset(
                year: Source.Year,
                month: Source.Month,
                day: DateTime.DaysInMonth(Source.Year, Source.Month),
                hour: 23,
                minute: 59,
                second: 59,
                offset: Source.Offset);
        }

        public override string ToString()
        {
            const string format = "yyyy-MM-dd";
            return Source.ToString(format);
        }
    }
}