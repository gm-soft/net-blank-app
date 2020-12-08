using Database;
using PC.Database;

namespace TestUtils.Database
{
    public static class InMemoryDatabaseHelper
    {
        public static DatabaseContext GetDbContext()
        {
            return new SqliteContext();
        }
    }
}
