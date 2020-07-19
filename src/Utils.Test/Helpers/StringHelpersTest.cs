using Utils.Helpers;
using Xunit;

namespace Utils.Test.Helpers
{
    public class StringHelpersTest
    {
        [Theory]
        [InlineData("@sd.com", false)]
        [InlineData("@sdcom", false)]
        [InlineData("js@contoso.中国", true)]
        [InlineData("j.s@server1.proseware.com", true)]
        [InlineData("j_9@[129.126.118.1]", true)]
        [InlineData("j..s@proseware.com", false)]
        [InlineData("js*@proseware.com", false)]
        [InlineData("js@proseware..com", false)]
        [InlineData("j.@server1.proseware.com", false)]
        public void EmailValidationTest(string email, bool result)
        {
            Assert.Equal(result, StringHelpers.IsValidEmail(email));
        }
    }
}