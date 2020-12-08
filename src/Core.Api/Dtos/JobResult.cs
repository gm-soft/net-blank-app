namespace Core.Api.Dtos
{
    public class JobResult
    {
        public JobResult()
        {
        }

        public JobResult(int count)
        {
            Count = count;
        }

        public int Count { get; set; }
    }
}