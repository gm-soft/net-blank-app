using System;
using System.Linq;
using Utils.Enums;
using Utils.Helpers;
using Utils.Interfaces;

namespace Utils.Dates
{
    /// <summary>
    /// THe class represents Date within the system.
    /// </summary>
    public class Date : IEquatable<Date>, ICloneable<Date>
    {
        /// <summary>
        /// Gets now.
        /// </summary>
        public static Date Now => new Date(DateTimeOffset.Now);

        /// <summary>
        /// Gets tomorrow.
        /// </summary>
        public static Date Tomorrow => new Date(new DateTimeOffset(DateTime.Today.AddDays(1)));

        /// <summary>
        /// Gets today.
        /// </summary>
        public static Date Today => new Date(new DateTimeOffset(DateTime.Today));

        /// <summary>
        /// Gets yesterday.
        /// </summary>
        public static Date Yesterday => new Date(new DateTimeOffset(DateTime.Today.AddDays(-1)));

        /// <summary>
        /// Gets month as int.
        /// </summary>
        public int Month => Source.Month;

        /// <summary>
        /// Gets year as int.
        /// </summary>
        public int Year => Source.Year;

        /// <summary>
        /// Gets day as int.
        /// </summary>
        public int Day => Source.Day;

        public DateTimeOffset Source { get; }

        public Date(DateTimeOffset source)
        {
            Source = source;
        }

        public Date(int year, int month, int day)
            : this(new DateTimeOffset(new DateTime(year, month, day)))
        {
        }

        public Date AddDays(int days)
        {
            return new Date(Source.AddDays(days));
        }

        public Date SubtractDays(int days)
        {
            return new Date(Source.AddDays(-1 * days));
        }

        public bool IsFirstDayOfMonth()
        {
            return Source.Day == 1;
        }

        public bool IsLastDayOfMonth()
        {
            return Day == DateTime.DaysInMonth(Year, Month);
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

        // TODO Maxim: rename to Morning
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

        // TODO Maxim: rename to Evening
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

        // // TODO Maxim: change return type to Date
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

        public bool Weekend()
        {
            return Source.DayOfWeek == DayOfWeek.Saturday || Source.DayOfWeek == DayOfWeek.Sunday;
        }

        public Month MonthAsEnum() => (Month)Month;

        public override string ToString()
        {
            const string format = "yyyy-MM-dd";
            return Source.ToString(format);
        }

        public Date Clone()
        {
            return new Date(Source);
        }

        public bool Equals(Date other)
        {
            if (other == null)
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return Source.Equal(other.Source);
        }

        public override bool Equals(object other)
        {
            if (other == null)
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            if (!(other is Date))
            {
                return false;
            }

            return Equals((Date)other);
        }

        public override int GetHashCode()
        {
            return Source.GetHashCode();
        }

        public Date PreviousWeekStartDate()
        {
            const int daysTillToday = 6;
            return new Date(Source.AddDays(-daysTillToday));
        }
    }
}