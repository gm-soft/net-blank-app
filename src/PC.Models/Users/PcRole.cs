using Utils.Enums;

namespace PC.Models.Users
{
    // TODO Maxim: seems like we do not need in this model in BL
    public class PcRole
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public Role Role { get; set; }
    }
}
