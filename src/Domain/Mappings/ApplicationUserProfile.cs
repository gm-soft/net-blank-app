using AutoMapper;
using Domain.Dtos.Users;
using PC.Models.Users;

namespace Domain.Mappings
{
    public class ApplicationUserProfile : Profile
    {
        public ApplicationUserProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}