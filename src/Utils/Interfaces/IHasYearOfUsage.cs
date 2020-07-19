using System.ComponentModel.DataAnnotations;

namespace Utils.Interfaces
{
    public interface IHasYearOfUsage
    {
        [Range(2000, 4000)]
        int YearOfUsage { get; set; }
    }
}