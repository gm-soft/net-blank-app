using AutoMapper;
using PC.Database.Models.Users;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using Utils.Helpers;

namespace PC.Domain.Services.Mappings.Users
{
    public class ApplicationUserProfile : Profile
    {
        public ApplicationUserProfile()
        {
            CreateMap<DbUser, ApplicationUser>()
                .ForMember(d => d.Role, o => o.Ignore());

            CreateMap<UserWithRole, ApplicationUser>().ConvertUsing(new UserWIthRoleMapping());
        }

        private class UserWIthRoleMapping : ITypeConverter<UserWithRole, ApplicationUser>
        {
            public ApplicationUser Convert(UserWithRole source, ApplicationUser destination, ResolutionContext context)
            {
                source.User.ThrowIfNull(
                    paramName: "source.User",
                    customErrorMessage: $"Could not map null as {nameof(ApplicationUser)}");

                destination = context.Mapper.Map(source.User, destination);
                destination.Role = source.Role;
                return destination;
            }
        }
    }
}