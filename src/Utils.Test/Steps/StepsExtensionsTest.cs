using Utils.Interfaces;
using Utils.Steps;
using Xunit;

namespace Utils.Test.Steps
{
    public class StepsExtensionsTest
    {
        [Theory]
        [InlineData(1, true)]
        [InlineData(2, false)]
        [InlineData(3, false)]
        [InlineData(null, false)]
        public void First_Cases(int? step, bool expected)
        {
            Assert.Equal(expected, new AwesomeStep(step).FirstStep());
        }

        [Theory]
        [InlineData(1, false)]
        [InlineData(2, true)]
        [InlineData(3, false)]
        [InlineData(null, false)]
        public void Second_Cases(int? step, bool expected)
        {
            Assert.Equal(expected, new AwesomeStep(step).SecondStep());
        }

        [Theory]
        [InlineData(1, false)]
        [InlineData(2, false)]
        [InlineData(3, true)]
        [InlineData(null, false)]
        public void Third_Cases(int? step, bool expected)
        {
            Assert.Equal(expected, new AwesomeStep(step).ThirdStep());
        }

        private class AwesomeStep : IHasStep
        {
            public AwesomeStep(int? step)
            {
                Step = step;
            }

            public int? Step { get; set; }
        }
    }
}