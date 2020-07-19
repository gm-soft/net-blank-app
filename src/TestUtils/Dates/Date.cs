using System;

namespace TestUtils.Dates
{
    public class Date
    {
        private readonly int _year;
        private readonly int _month;
        private readonly int _day;
        private readonly int _hour;
        private readonly int _minute;
        private readonly int _sec;

        public Date(int year, int month, int day, int hour = 0, int minute = 0, int sec = 0)
        {
            _year = year;
            _month = month;
            _day = day;
            _hour = hour;
            _minute = minute;
            _sec = sec;
        }

        public DateTimeOffset TimeOffset()
        {
            return new DateTimeOffset(Time());
        }

        public DateTime Time()
        {
            return new DateTime(
                year: _year,
                month: _month,
                day: _day,
                hour: _hour,
                minute: _minute,
                second: _sec);
        }

        public static Date Today()
        {
            var today = new DateTimeOffset(DateTime.Today);
            return new Date(
                year: today.Year,
                month: today.Month,
                day: today.Day,
                hour: today.Hour,
                minute: today.Minute,
                sec: today.Second);
        }
    }
}