using System.Collections.Generic;
using System.Reflection;
using AutoMapper;

namespace Domain.Mappings
{
    public static class CoreMappings
    {
        public static Assembly GetAssembly()
        {
            return typeof(CoreMappings).Assembly;
        }

        public static IEnumerable<Profile> GetProfiles()
        {
            yield return new ApplicationUserProfile();
        }
    }
}