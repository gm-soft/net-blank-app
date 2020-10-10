using AutoMapper;
using PC.Database.Models.Users;
using PC.Models.Users;

namespace PC.Domain.Services.Mappings.Users
{
    public class RoleProfile : Profile
    {
        public RoleProfile()
        {
            CreateMap<PcRole, DbIdentityRole>()
                .ForMember(d => d.NormalizedName, o => o.Ignore())
                .ForMember(d => d.ConcurrencyStamp, o => o.Ignore());

            CreateMap<DbIdentityRole, PcRole>();
        }
    }
}