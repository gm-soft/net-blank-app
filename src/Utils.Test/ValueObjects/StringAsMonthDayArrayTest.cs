using System.Collections.Generic;
using System.Linq;
using Utils.ValueObjects;
using Xunit;

namespace Utils.Test.ValueObjects
{
    public class StringAsMonthDayArrayTest
    {
        [Fact]
        public void Result_EmptyString_EmptyCollection()
        {
            var target = Target(string.Empty);
            Assert.Empty(target.Result());
        }

        [Fact]
        public void Result_Null_EmptyCollection()
        {
            var target = Target(null);

            Assert.Empty(target.Result());
        }

        [Fact]
        public void Result_InvalidValues_EmptyCollection()
        {
            var target = Target("ololo, elelele, 123545234;ewerwer.sdfsdf");
            Assert.Empty(target.Result());
        }

        [Fact]
        public void Result_InvalidDates_EmptyCollection()
        {
            var target = Target("-1, 34, 0");
            Assert.Empty(target.Result());
        }

        [Fact]
        public void GetHolidays_OneValidDate_NotEmptyCollection()
        {
            var target = Target("-1, 20, 34");
            IReadOnlyCollection<int> result = target.Result();

            Assert.NotEmpty(result);
            Assert.Equal(1, result.Count);
            Assert.Equal(20, result.First());
        }

        private StringAsMonthDayArray Target(string source)
        {
            return new StringAsMonthDayArray(source);
        }
    }
}