using System;
using System.Collections.Generic;
using System.Linq;
using Utils.Helpers;

namespace Utils.Dates
{
    /// <summary>
    /// Represents a range of time between two dates: <see cref="From"/> and <see cref="To"/>.
    /// <see cref="From"/> is always earlier than <see cref="To"/>. Otherwise, an exception will be thrown.
    /// </summary>
    public class TimeRange
    {
        public static DateTimeOffset Max { get; } = new DateTimeOffsetExtended(2100, 12, 31).EndOfTheDay();

        public static DateTimeOffset Min { get; } = new DateTimeOffsetExtended(2000, 1, 1).StartOfTheDay();

        private readonly DateTimeOffsetExtended _from;

        private readonly DateTimeOffsetExtended _to;

        /// <summary>
        /// Gets start of the range.
        /// </summary>
        public DateTimeOffset From => _from.Source;

        /// <summary>
        /// Gets finish date of the range.
        /// </summary>
        public DateTimeOffset To => _to.Source;

        public TimeRange(DateTimeOffset date)
            : this(date, date)
        {
        }

        public TimeRange(DateTimeOffset @from, DateTimeOffset? to)
        {
            _from = new DateTimeOffsetExtended(@from);
            _to = new DateTimeOffsetExtended(to ?? @from);

            if (_from.Later(_to))
            {
                throw new InvalidOperationException($"'{nameof(From)}' should not be later than '{nameof(To)}'");
            }
        }

        /// <summary>
        /// Returns a collection of <see cref="TimeRange"/> where
        /// every item represents each day between source From and To dates range.
        /// From is equal to start of the single day and To is equal to end of the day.
        /// </summary>
        /// <returns>Collection of Time Ranges.</returns>
        public IReadOnlyCollection<DayRange> SplitByDays()
        {
            var list = new List<DayRange>();

            if (_from.Source.SameDay(_to.Source))
            {
                list.Add(new DayRange(_from));
                return list;
            }

            var from = _from.StartOfTheDay();
            var to = _to.EndOfTheDay();

            for (DateTimeOffset currentDay = from; currentDay <= to; currentDay = currentDay.AddDays(1))
            {
                list.Add(new DayRange(new DateTimeOffsetExtended(currentDay)));
            }

            return list;
        }

        /// <summary>
        /// Returns a collection of <see cref="TimeRange"/> where
        /// From is a start of the month (or <see cref="From"/>) and To is the end of the month (or <see cref="To"/>).
        /// At least one time range will be returned.
        /// </summary>
        /// <returns>Collection of Time Ranges.</returns>
        public IReadOnlyCollection<MonthRange> SplitByMonths()
        {
            var list = new List<MonthRange>();

            if (SameMonth())
            {
                list.Add(new MonthRange(@from: _from.StartOfTheDay(), to: _to.EndOfTheDay()));
                return list;
            }

            DateTimeOffset firstDayOfTheLastTimelineMonth = _to.FirstDayOfMonth();

            // Add first month remaining days
            list.Add(new MonthRange(_from.StartOfTheDay(), _from.LastDayOfMonth()));

            // Add All months days in between
            for (var st = From.AddMonths(1); st < firstDayOfTheLastTimelineMonth; st = st.AddMonths(1))
            {
                var extended = new DateTimeOffsetExtended(st);
                list.Add(new MonthRange(extended.FirstDayOfMonth(), extended.LastDayOfMonth()));
            }

            // Add last month days
            list.Add(new MonthRange(firstDayOfTheLastTimelineMonth, _to.EndOfTheDay()));

            return list;
        }

        // TODO Maxim: unittests
        public bool SameMonth()
        {
            return _from.Source.SameMonth(_to.Source);
        }

        // TODO Maxim: unittests
        public bool FullMonth()
        {
            if (!SameMonth())
            {
                return false;
            }

            return _from.IsFirstDayOfMonth() && _to.IsLastDayOfMonth();
        }

        // TODO Maxim: unittests
        public bool Contains(TimeRange range)
        {
            return range._from.Source >= _from.Source &&
                   range._to.Source <= _to.Source;
        }

        public TimeRange IntersectionOrNull(TimeRange second)
        {
            if (this.Contains(second))
            {
                return second;
            }

            if (second.Contains(this))
            {
                return this;
            }

            if (second.From.EarlierOrEqual(_from.Source) &&
                second.To.LaterOrEqual(_from.Source) &&
                second.To.EarlierOrEqual(_to.Source))
            {
                return new TimeRange(
                    new DateTimeOffsetExtended(From).StartOfTheDay(),
                    new DateTimeOffsetExtended(second.To).EndOfTheDay());
            }

            if (second.From.LaterOrEqual(_from.Source) &&
                second.From.EarlierOrEqual(_to.Source) &&
                second.To.LaterOrEqual(_to.Source))
            {
                return new TimeRange(
                    new DateTimeOffsetExtended(second.From).StartOfTheDay(),
                    new DateTimeOffsetExtended(_to.Source).EndOfTheDay());
            }

            return null;
        }

        public IReadOnlyCollection<DayRange> WorkDays()
        {
            var days = SplitByDays();

            return days.Where(x => !x.Weekend()).ToArray();
        }

        public override string ToString()
        {
            return $"{GetType().Name}. [{_from}:{_to}]";
        }

        public override bool Equals(object obj)
        {
            return obj != null && Equals(obj as TimeRange);
        }

        // was generated by Resharper
        public override int GetHashCode()
        {
            unchecked
            {
                return (_from.Source.GetHashCode() * 397) ^ _to.Source.GetHashCode();
            }
        }

        public bool Equals(TimeRange range)
        {
            return range != null && _from.Source.Equal(range.From) && _to.Source.Equal(range.To);
        }
    }
}