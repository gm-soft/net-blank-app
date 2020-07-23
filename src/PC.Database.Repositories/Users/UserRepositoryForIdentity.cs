using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PC.Database.Repositories.Dto;
using PC.Models.Users;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;

namespace PC.Database.Repositories.Users
{
    public class UserRepositoryForIdentity : IUserRepositoryForIdentity
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public UserRepositoryForIdentity(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Role> RoleOfUserAsync(long userId)
        {
            return await _context.RoleOfUserAsync(userId);
        }

        public async Task<IReadOnlyCollection<ApplicationUser>> UsersWithRoleAsync()
        {
            UserWithRole[] users = await _context.Users.AttachRoles(_context).ToArrayAsync();
            return _mapper.Map<IReadOnlyCollection<ApplicationUser>>(users);
        }

        public async Task<ApplicationUser> UserByEmailOrNullAsync(string email)
        {
            email.ThrowIfNullOrEmpty(nameof(email));

            UserWithRole user = await _context
                .Users
                .SearchBy(email: email)
                .AttachRoles(_context)
                .FirstOrDefaultAsync();

            return _mapper.Map<ApplicationUser>(user);
        }

        public async Task<bool> HasEntityAsync(long id)
        {
            return await _context.Users.AnyAsync(x => x.Id == id);
        }

        public async Task<UserWithRole> UserWithRoleOrFailAsync(long id)
        {
            return await _context
                       .Users
                       .SearchBy(id: id)
                       .AttachRoles(_context)
                       .FirstOrDefaultAsync()
                   ?? throw ResourceNotFoundException.CreateFromEntity<ApplicationUser>(id);
        }
    }
}