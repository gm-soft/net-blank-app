using System;
using TestUtils.Dates;
using Utils.Dates;
using Xunit;

namespace Utils.Test.Dates
{
    public class DateTimeOffsetExtendedTest
    {
        [Fact]
        public void Today_Ok()
        {
            Assert.Equal(
                new DateTimeOffset(DateTime.Today),
                DateTimeOffsetExtended.Today.Source);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(3)]
        [InlineData(28)]
        [InlineData(29)]
        public void FirstDayOfMonth_Ok(int day)
        {
            Assert.Equal(
                expected: Date(2020, 2, 1, 0, 0, 0),
                actual: new DateTimeOffsetExtended(2020, 2, day).FirstDayOfMonth());
        }

        [Theory]
        [InlineData(1)]
        [InlineData(3)]
        [InlineData(28)]
        [InlineData(29)]
        public void LastDayOfMonth_Ok(int day)
        {
            Assert.Equal(
                expected: Date(2020, 2, 29, 23, 59, 59),
                actual: new DateTimeOffsetExtended(2020, 2, day).LastDayOfMonth());
        }

        [Theory]
        [InlineData(2, 3, 4)]
        [InlineData(0, 0, 4)]
        [InlineData(23, 59, 58)]
        public void StartOfTheDay_Ok(int hour, int minute, int sec)
        {
            Assert.Equal(
                expected: Date(2020, 6, 12, 0, 0, 0),
                actual: new DateTimeOffsetExtended(
                    Date(2020, 6, 12, hour, minute, sec)).StartOfTheDay());
        }

        [Theory]
        [InlineData(2, 3, 4)]
        [InlineData(0, 0, 4)]
        [InlineData(23, 59, 58)]
        public void EndOfTheDay_Ok(int hour, int minute, int sec)
        {
            Assert.Equal(
                expected: Date(2020, 6, 12, 23, 59, 59),
                actual: new DateTimeOffsetExtended(
                    Date(2020, 6, 12, hour, minute, sec)).EndOfTheDay());
        }

        private DateTimeOffset Date(int year, int month, int day, int hour = 0, int minute = 0, int sec = 0)
        {
            return new Date(year, month, day, hour, minute, sec).TimeOffset();
        }
    }
}