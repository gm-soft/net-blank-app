using System;
using TestUtils.Dates;
using Utils.Dates;
using Xunit;

namespace Utils.Test.Dates
{
    public class DayRangeTest
    {
        private DateTimeOffset Date(int year, int month, int day, int hour = 0, int minute = 0, int sec = 0)
        {
            return new Date(year, month, day, hour, minute, sec).TimeOffset();
        }

        [Fact]
        public void Ctor_FromToValid_Ok()
        {
            var target = new DayRange(new DateTimeOffsetExtended(2020, 6, 12));

            Assert.Equal(Date(2020, 6, 12, 0, 0, 0), target.From);
            Assert.Equal(Date(2020, 6, 12, 23, 59, 59), target.To);
        }

        [Fact]
        public void Properties_Ok()
        {
            var target = new DayRange(new DateTimeOffsetExtended(2020, 6, 12));

            Assert.Equal(6, target.Month);
            Assert.Equal(2020, target.Year);
        }
    }
}