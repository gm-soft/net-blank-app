using Utils.Enums;

namespace Utils.Interfaces
{
    public interface IHasStatus
    {
        Status Status { get; set; }

        bool Active { get; }
    }
}