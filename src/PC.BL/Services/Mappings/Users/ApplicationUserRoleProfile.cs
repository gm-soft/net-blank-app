using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace PC.Services.Mappings.Users
{
    public class ApplicationUserRoleProfile : Profile
    {
        public ApplicationUserRoleProfile()
        {
            CreateMap<Models.Users.ApplicationUserRole, IdentityUserRole<long>>();
        }
    }
}