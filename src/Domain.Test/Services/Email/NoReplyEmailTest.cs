using System;
using System.Collections.Generic;
using PC.Domain.Test.Services.Email;
using Xunit;

namespace Domain.Test.Services.Email
{
    public class NoReplyEmailTest
    {
        private const string ValidEmail = "j.smith@example.com";
        private const string InvalidEmail = "j.smith@example";
        private const string EmptyString = "";

        [Theory]
        [InlineData(null, "View path")]
        [InlineData(EmptyString, "View path")]
        [InlineData("subject", null)]
        [InlineData("subject", EmptyString)]
        public void ThrowIfInvalid_InvalidViewPathAndSubject_Exception(string subject, string viewPath)
        {
            var t = new NoReplyEmailStub(
                recipients: new[] { ValidEmail },
                cc: null,
                subject: subject,
                viewPath: viewPath,
                renderer: new ViewRendererFake());

            Assert.Throws<ArgumentNullException>(() => t.ThrowIfInvalid());
        }

        [Fact]
        public void Ctor_NullRenderer_Exception()
        {
            Assert.Throws<ArgumentNullException>(() => new NoReplyEmailStub(
                recipients: new[] { ValidEmail },
                cc: null,
                subject: "Subject",
                viewPath: "View/Path",
                renderer: null));
        }

        [Theory]
        [InlineData(new string[0], null)]
        [InlineData(new string[0], new[] { ValidEmail })]
        public void Ctor_EmptyRecipients_Exception(IReadOnlyCollection<string> recipients, IReadOnlyCollection<string> cc)
        {
            var email = new NoReplyEmailStub(
                recipients,
                cc,
                subject: "Awesome subject",
                viewPath: "viewPath",
                renderer: new ViewRendererFake());

            Assert.Throws<InvalidOperationException>(() => email.ThrowIfInvalid());
        }

        [Theory]
        [InlineData(new[] { ValidEmail }, new[] { InvalidEmail })]
        [InlineData(new[] { ValidEmail, InvalidEmail }, new[] { ValidEmail, InvalidEmail })]
        [InlineData(new[] { InvalidEmail }, new[] { ValidEmail })]
        [InlineData(new[] { EmptyString }, new[] { ValidEmail })]
        [InlineData(new[] { ValidEmail }, new[] { EmptyString })]
        [InlineData(new[] { EmptyString, ValidEmail }, new[] { ValidEmail, EmptyString })]
        public void ThrowIfInvalid_InvalidEmails_Exception(
            IReadOnlyCollection<string> recipients, IReadOnlyCollection<string> cc)
        {
            var email = new NoReplyEmailStub(
                recipients,
                cc,
                subject: "Awesome subject",
                viewPath: "viewPath",
                renderer: new ViewRendererFake());

            Assert.Throws<InvalidOperationException>(() => email.ThrowIfInvalid());
        }
    }
}