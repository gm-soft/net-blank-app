using System.Diagnostics;

namespace PC.Domain.Health
{
    public class WebAppInfo<TClassForAssembly>
    {
        public string Version { get; }

        public string CreatedAt { get; }

        public WebAppInfo()
        {
            var assembly = typeof(TClassForAssembly).Assembly;
            CreatedAt = System.IO.File.GetCreationTime(assembly.Location).ToString("s");
            Version = FileVersionInfo.GetVersionInfo(assembly.Location).ProductVersion;
        }
    }
}