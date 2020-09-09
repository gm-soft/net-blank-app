using System.Collections.Generic;

namespace Utils.Pagination
{
    // TODO Maxim: rename to Paginated
    public class PaginatedList<T> : PaginatedListBase
    {
        public IReadOnlyCollection<T> Results { get; set; }

        public PaginatedList()
        {
            Results = new List<T>();
        }
    }
}
