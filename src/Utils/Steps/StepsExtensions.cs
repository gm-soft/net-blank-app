using Utils.Helpers;
using Utils.Interfaces;

namespace Utils.Steps
{
    public static class StepsExtensions
    {
        public static bool FirstStep(this IHasStep instance)
        {
            return StepEqualsTo(instance, 1);
        }

        public static bool SecondStep(this IHasStep instance)
        {
            return StepEqualsTo(instance, 2);
        }

        public static bool ThirdStep(this IHasStep instance)
        {
            return StepEqualsTo(instance, 3);
        }

        private static bool StepEqualsTo(IHasStep instance, int step)
        {
            instance.ThrowIfNull(nameof(instance));

            return instance.Step == step;
        }
    }
}