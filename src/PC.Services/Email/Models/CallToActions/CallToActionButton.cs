namespace PC.Services.Email.Models.CallToActions
{
    public class CallToActionButton
    {
        public CallToActionButton(ILink link)
            : this("Go to portal", link.Value)
        {
        }

        public CallToActionButton(string title, ILink link)
            : this(title, link.Value)
        {
        }

        public CallToActionButton(string title, string link)
        {
            Title = title;
            Link = link;
        }

        public string Link { get; }

        public string Title { get; }
    }
}