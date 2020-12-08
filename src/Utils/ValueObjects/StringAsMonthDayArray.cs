using System;
using System.Collections.Generic;
using Utils.Helpers;

namespace Utils.ValueObjects
{
    public class StringAsMonthDayArray
    {
        private readonly string _source;

        public StringAsMonthDayArray(string source)
        {
            _source = source;
        }

        public IReadOnlyCollection<int> Result()
        {
            if (_source.IsNullOrEmpty())
            {
                return Array.Empty<int>();
            }

            string[] split = _source.Split(",");
            var list = new List<int>();

            foreach (string s in split)
            {
                // We softly parse holidays to avoid some possible issues in future.
                // The soft parsing allows us to fix the string.
                if (int.TryParse(s, out var result))
                {
                    if (result >= 1 && result <= 31)
                    {
                        list.Add(result);
                    }
                }
            }

            return list;
        }
    }
}