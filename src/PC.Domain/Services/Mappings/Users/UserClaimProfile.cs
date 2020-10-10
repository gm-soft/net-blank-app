using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PC.Models.Users;

namespace PC.Domain.Services.Mappings.Users
{
    public class UserClaimProfile : Profile
    {
        public UserClaimProfile()
        {
            CreateMap<ApplicationUserClaim, IdentityUserClaim<long>>();
        }
    }
}