using System.Collections.Generic;

namespace Utils.Helpers
{
    public static class Converters
    {
        public static LinkedList<T> ToLinkedList<T>(this IEnumerable<T> source)
        {
            source.ThrowIfNull(nameof(source));

            if (source is LinkedList<T> linked)
            {
                return linked;
            }

            return new LinkedList<T>(source);
        }
    }
}