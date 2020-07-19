namespace PC.Models.Users
{
    // TODO Maxim: remove
    public class ApplicationUserClaim
    {
        public long Id { get; set; }

        public long UserId { get; set; }

        public string ClaimType { get; set; }

        public string ClaimValue { get; set; }
    }
}
