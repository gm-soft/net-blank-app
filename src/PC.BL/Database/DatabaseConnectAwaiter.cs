using System;
using System.Threading;
using System.Threading.Tasks;
using PC.Database;

namespace PC.BL.Database
{
    public class DatabaseConnectAwaiter
    {
        private readonly DatabaseContext _context;

        private readonly TimeSpan _timeout;

        private readonly TimeSpan _delayTime;

        public DatabaseConnectAwaiter(DatabaseContext context)
        {
            _context = context;

            // TODO Maxim: get values for the timespan from config files.
            _timeout = TimeSpan.FromSeconds(60);
            _delayTime = TimeSpan.FromSeconds(2);
        }

        public async Task ExecuteAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            CancellationToken token = CreateMixedToken(cancellationToken);

            while (true)
            {
                if (token.IsCancellationRequested || await _context.Database.CanConnectAsync(token))
                {
                    break;
                }

                await Task.Delay(_delayTime, cancellationToken);
            }
        }

        private CancellationToken CreateMixedToken(CancellationToken cancellationTokenFromArgument)
        {
            return CancellationTokenSource.CreateLinkedTokenSource(
                cancellationTokenFromArgument,
                new CancellationTokenSource(_timeout).Token).Token;
        }
    }
}