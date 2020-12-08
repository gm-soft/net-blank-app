using System.ComponentModel.DataAnnotations;

namespace Utils.Pagination
{
    public class PageModel
    {
        [Range(1, int.MaxValue)]
        public int? Page { get; set; }

        [Range(1, int.MaxValue)]
        public int? PageSize { get; set; }
    }
}
