using System;
using System.Collections.Generic;
using System.Linq;
using TestUtils.Dates;
using Utils.Dates;
using Xunit;

namespace Utils.Test.Dates
{
    public class TimeRangeTest
    {
        [Fact]
        public void Ctor_FromLaterThanTo_Exception()
        {
            var from = DateTimeOffset.Now.Subtract(TimeSpan.FromDays(2));
            var to = from.Subtract(TimeSpan.FromDays(5));

            Assert.Throws<InvalidOperationException>(() => new TimeRange(from, to));
        }

        [Fact]
        public void Ctor_NoToValue_FromIsCopied()
        {
            var from = DateTimeOffset.Now.Subtract(TimeSpan.FromDays(2));
            var target = new TimeRange(from);

            Assert.NotEqual(default(DateTimeOffset), target.To);
            Assert.Equal(from, target.From);

            Assert.Equal(target.From, target.To);
        }

        [Fact]
        public void Ctor_ToValue_Ok()
        {
            var from = DateTimeOffset.Now.Subtract(TimeSpan.FromDays(2));
            var to = from.AddDays(5);
            var target = new TimeRange(from, to);

            Assert.Equal(to, target.To);
            Assert.Equal(from, target.From);
        }

        [Fact]
        public void TimeRangesByMonths_OnlyOneMonth_Ok()
        {
            var first = Date(2020, 5, 1);
            var second = Date(2020, 5, 15);

            var target = new TimeRange(first, second);

            IReadOnlyCollection<MonthRange> timeRanges = target.SplitByMonths();

            Assert.NotNull(timeRanges);
            Assert.NotEmpty(timeRanges);

            Assert.Single(timeRanges);

            var timeline = timeRanges.First();
            Assert.Equal(first, timeline.From);
            Assert.Equal(Date(2020, 5, 15, 23, 59, 59), timeline.To);
        }

        [Fact]
        public void TimeRangesByMonths_TwoMonths_Ok()
        {
            var first = Date(2020, 4, 1);
            var second = Date(2020, 5, 31);

            var target = new TimeRange(first, second);

            IReadOnlyCollection<MonthRange> timeRanges = target.SplitByMonths();

            Assert.NotNull(timeRanges);
            Assert.NotEmpty(timeRanges);

            Assert.Equal(2, timeRanges.Count);

            var firstTimeLine = timeRanges.ElementAt(0);
            var secondTimeLine = timeRanges.ElementAt(1);

            Assert.Equal(first, firstTimeLine.From);
            Assert.Equal(
                Date(2020, 4, 30, 23, 59, 59),
                firstTimeLine.To);

            Assert.Equal(Date(2020, 5, 1), secondTimeLine.From);
            Assert.Equal(new DateTimeOffsetExtended(second).EndOfTheDay(), secondTimeLine.To);
        }

        [Fact]
        public void TimeRangesByMonths_ThreeMonths_Ok()
        {
            var first = Date(2020, 3, 15);
            var second = Date(2020, 5, 15);

            var target = new TimeRange(first, second);

            IReadOnlyCollection<MonthRange> timeRanges = target.SplitByMonths();

            Assert.NotNull(timeRanges);
            Assert.NotEmpty(timeRanges);

            Assert.Equal(3, timeRanges.Count);

            var firstTimeLine = timeRanges.ElementAt(0);
            var secondTimeLine = timeRanges.ElementAt(1);
            var thirdTimeLine = timeRanges.ElementAt(2);

            Assert.Equal(first, firstTimeLine.From);
            Assert.Equal(Date(2020, 3, 31, 23, 59, 59), firstTimeLine.To);

            Assert.Equal(Date(2020, 4, 1), secondTimeLine.From);
            Assert.Equal(Date(2020, 4, 30, 23, 59, 59), secondTimeLine.To);

            Assert.Equal(Date(2020, 5, 1), thirdTimeLine.From);
            Assert.Equal(new DateTimeOffsetExtended(second).EndOfTheDay(), thirdTimeLine.To);
        }

        private DateTimeOffset Date(int year, int month, int day, int hour = 0, int minute = 0, int sec = 0)
        {
            return new Date(year, month, day, hour, minute, sec).TimeOffset();
        }

        [Fact]
        public void SplitByDays_SameMonth_Ok()
        {
            var target = new TimeRange(Date(2020, 6, 9), Date(2020, 6, 11));
            IReadOnlyCollection<TimeRange> days = target.SplitByDays();

            var expected = new List<TimeRange>
            {
                new TimeRange(
                    Date(2020, 6, 9, 0, 0, 0),
                    Date(2020, 6, 9, 23, 59, 59)),
                new TimeRange(
                    Date(2020, 6, 10, 0, 0, 0),
                    Date(2020, 6, 10, 23, 59, 59)),
                new TimeRange(
                    Date(2020, 6, 11, 0, 0, 0),
                    Date(2020, 6, 11, 23, 59, 59)),
            };

            AssertCollections(expected, days);
        }

        [Fact]
        public void SplitByDays_DifferentMonth_Ok()
        {
            var target = new TimeRange(Date(2020, 5, 30), Date(2020, 6, 2));
            IReadOnlyCollection<TimeRange> days = target.SplitByDays();

            var expected = new List<TimeRange>
            {
                new TimeRange(
                    Date(2020, 5, 30, 0, 0, 0),
                    Date(2020, 5, 30, 23, 59, 59)),
                new TimeRange(
                    Date(2020, 5, 31, 0, 0, 0),
                    Date(2020, 5, 31, 23, 59, 59)),
                new TimeRange(
                    Date(2020, 6, 1, 0, 0, 0),
                    Date(2020, 6, 1, 23, 59, 59)),
                new TimeRange(
                    Date(2020, 6, 2, 0, 0, 0),
                    Date(2020, 6, 2, 23, 59, 59)),
            };

            AssertCollections(expected, days);
        }

        private void AssertCollections<T>(IEnumerable<T> expected, IEnumerable<T> actual)
        {
            var count = actual.Count();
            Assert.Equal(expected.Count(), count);
            for (int i = 0; i < count; i++)
            {
                Assert.Equal(expected.ElementAt(i), actual.ElementAt(i));
            }
        }

        [Fact]
        public void IntersectionOrNull_RangeContainsSecond_Ok()
        {
            var first = new TimeRange(Date(2020, 6, 1), Date(2020, 6, 30));
            var second = new TimeRange(
                @from: Date(2020, 6, 5),
                to: Date(2020, 6, 20, 23, 59, 59));

            TimeRange intersection = first.IntersectionOrNull(second);

            Assert.NotNull(intersection);
            Assert.Equal(Date(2020, 6, 5), intersection.From);
            Assert.Equal(
                Date(2020, 6, 20, 23, 59, 59),
                intersection.To);
        }

        [Fact]
        public void IntersectionOrNull_SecondContainsTheFirstOne_Ok()
        {
            var first = new TimeRange(
                Date(2020, 6, 1),
                Date(2020, 6, 30, 23, 59, 59));

            var second = new TimeRange(
                @from: Date(2020, 5, 5),
                to: Date(2020, 7, 20, 23, 59, 59));

            TimeRange intersection = first.IntersectionOrNull(second);

            Assert.NotNull(intersection);
            Assert.Equal(Date(2020, 6, 1), intersection.From);
            Assert.Equal(
                Date(2020, 6, 30, 23, 59, 59),
                intersection.To);
        }

        [Fact]
        public void IntersectionOrNull_SecondStartsEarlierThanTheFirstOne_Ok()
        {
            var first = new TimeRange(
                Date(2020, 6, 1),
                Date(2020, 6, 30, 23, 59, 59));

            var second = new TimeRange(
                @from: Date(2020, 5, 5),
                to: Date(2020, 6, 20, 23, 59, 59));

            TimeRange intersection = first.IntersectionOrNull(second);

            Assert.NotNull(intersection);
            Assert.Equal(Date(2020, 6, 1), intersection.From);
            Assert.Equal(
                Date(2020, 6, 20, 23, 59, 59),
                intersection.To);
        }

        [Fact]
        public void IntersectionOrNull_SecondFinishesLaterThanTheFirstOne_Ok()
        {
            var first = new TimeRange(
                Date(2020, 6, 1),
                Date(2020, 6, 30, 23, 59, 59));

            var second = new TimeRange(
                @from: Date(2020, 6, 15),
                to: Date(2020, 8, 20, 23, 59, 59));

            TimeRange intersection = first.IntersectionOrNull(second);

            Assert.NotNull(intersection);
            Assert.Equal(Date(2020, 6, 15), intersection.From);
            Assert.Equal(
                Date(2020, 6, 30, 23, 59, 59),
                intersection.To);
        }

        [Fact]
        public void IntersectionOrNull_NoIntersections_ReturnsNull_Ok()
        {
            var first = new TimeRange(
                Date(2020, 6, 1),
                Date(2020, 6, 30, 23, 59, 59));

            var second = new TimeRange(
                @from: Date(2020, 4, 15),
                to: Date(2020, 5, 20, 23, 59, 59));

            TimeRange intersection = first.IntersectionOrNull(second);

            Assert.Null(intersection);
        }
    }
}