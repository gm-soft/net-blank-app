using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Moq;
using PC.Services.Auth;
using TestUtils.Identity;
using Xunit;

namespace PC.Domain.Test.Services.Auth
{
    public class UserClaimsProviderTest
    {
        [Fact]
        public void GetUserClaims_HasContext_ReturnsClaims()
        {
            var httpAccessor = new Mock<IHttpContextAccessor>();
            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns(
                new ClaimsPrincipalFactory()
                    .AddClaim("Key", "Value")
                    .Build());

            httpAccessor.Setup((a) => a.HttpContext).Returns(httpContext.Object);

            var target = new UserClaimsProvider(httpAccessor.Object);
            ClaimsPrincipal user = target.GetUserClaims();

            Assert.NotNull(user);
            Assert.Single(user.Claims);

            var claim = user.Claims.First();
            Assert.Equal("Key", claim.Type);
            Assert.Equal("Value", claim.Value);
        }

        [Fact]
        public void GetUserClaims_NoContext_ReturnsNull()
        {
            var httpAccessor = new Mock<IHttpContextAccessor>();

            httpAccessor.Setup((a) => a.HttpContext).Returns((HttpContext)null);

            var target = new UserClaimsProvider(httpAccessor.Object);
            ClaimsPrincipal user = target.GetUserClaims();

            Assert.Null(user);
        }

        [Fact]
        public void GetUserClaims_NoUser_ReturnsNull()
        {
            var httpAccessor = new Mock<IHttpContextAccessor>();
            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.User).Returns((ClaimsPrincipal)null);

            httpAccessor.Setup((a) => a.HttpContext).Returns(httpContext.Object);

            var target = new UserClaimsProvider(httpAccessor.Object);
            ClaimsPrincipal user = target.GetUserClaims();

            Assert.Null(user);
        }
    }
}