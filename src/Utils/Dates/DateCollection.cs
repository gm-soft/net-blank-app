using System.Collections.Generic;
using System.Linq;
using Utils.Enums;
using Utils.Helpers;

namespace Utils.Dates
{
    public class DateCollection<T>
        where T : class, IHasYearMonth
    {
        private readonly IReadOnlyCollection<T> _items;

        public DateCollection(params T[] items)
            : this((IReadOnlyCollection<T>)items)
        {
        }

        public DateCollection(IReadOnlyCollection<T> items)
        {
            items.ThrowIfNull(nameof(items));

            _items = items;
        }

        public T ItemOrNull(int year, int month) => ItemOrNull(year, (Month)month);

        public T ItemOrNull(int year, Month month)
        {
            return _items.FirstOrDefault(x => x.Year == year && x.Month == month);
        }
    }
}