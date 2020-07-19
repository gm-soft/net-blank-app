using System;
using Microsoft.EntityFrameworkCore;
using PC.Database;

namespace PC.BL.Database
{
    public class DatabaseMigration
    {
        private readonly DatabaseContext _context;

        public DatabaseMigration(DatabaseContext context)
        {
            _context = context;
        }

        public void Execute()
        {
            try
            {
                _context.Database.Migrate();
            }
            catch (Exception exception)
            {
                throw new InvalidOperationException("Cannot migrate database", exception);
            }
        }
    }
}