using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Utils.Helpers
{
    /// <summary>
    /// copied from https://docs.microsoft.com/en-us/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format.
    /// </summary>
    public static class StringHelpers
    {
        // TODO Maxim: make this class non-static and inject into other classes wherever it is necessary.
        // TODO Maxim: inject timeout value into this class via settings.
        // TODO Maxim: inject valid email domains
        private static readonly Regex _emailValidationRegex
            = new Regex(
                pattern: @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                         @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                options: RegexOptions.Compiled | RegexOptions.IgnoreCase,
                matchTimeout: TimeSpan.FromMilliseconds(250));

        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            if (!TryNormalizeEmail(email, out email))
            {
                return false;
            }

            try
            {
                return _emailValidationRegex.IsMatch(email);
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        private static bool TryNormalizeEmail(string email, out string result)
        {
            result = null;
            try
            {
                // Normalize the domain
                result = Regex.Replace(
                    input: email,
                    pattern: @"(@)(.+)$",
                    evaluator: DomainMapper,
                    options: RegexOptions.None,
                    matchTimeout: TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    var domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }

                return true;
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
            catch (ArgumentException)
            {
                return false;
            }
        }

        public static bool IsNullOrEmpty(this string @string)
        {
            return string.IsNullOrEmpty(@string);
        }
    }
}