﻿using Utils.ValueObjects;
using Xunit;

namespace Utils.Test.ValueObjects
{
    public class BoolTest
    {
        [Theory]
        [InlineData("True", true)]
        [InlineData("true", true)]
        [InlineData("TruE", true)]
        [InlineData("False", false)]
        [InlineData("false", false)]
        [InlineData("FalsE", false)]
        public void Value_ValidBoolString_Ok(string source, bool expected)
        {
            Assert.Equal(expected, new Bool(source).Value());
        }

        [Theory]
        [InlineData("1")]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("1001")]
        [InlineData("0")]
        [InlineData("-")]
        [InlineData("ololo")]
        public void Value_InvalidBoolString_False(string source)
        {
            Assert.False(new Bool(source).Value());
        }

        [Theory]
        [InlineData("True", true)]
        [InlineData("true", true)]
        [InlineData("TruE", true)]
        [InlineData("False", false)]
        [InlineData("false", false)]
        [InlineData("FalsE", false)]
        public void Equals_DifferentCases_Ok(string source, bool toCompare)
        {
            Assert.True(new Bool(source).Equals(toCompare));
        }
    }
}