using System;

namespace PC.Models.Email
{
    public class EmployeeUpdatedViewModel
    {
        public string FirstName { get; set; }

        public string ParamName { get; set; }

        public string CurrentUserName { get; set; }

        public DateTimeOffset? ToDate { get; set; }

        public override string ToString()
        {
            const string format = "yyyy-MM-dd";
            return ToDate?.ToString(format);
        }
    }
}
