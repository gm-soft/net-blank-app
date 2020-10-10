using System;
using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc.Filters;
using PC.Domain.Services.Claims;
using Utils.Enums;
using Utils.Exceptions;

namespace PC.Domain.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class RoleAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        private readonly Role _minimalRole;

        public RoleAuthorizeAttribute(Role minimalRole)
        {
            _minimalRole = minimalRole;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = new ClaimsUser(context.HttpContext.User);

            if (!user.HasAuth)
            {
               throw new AuthenticationException("You have to be authorized to execute the operation");
            }

            if (user.Role < _minimalRole)
            {
                throw new NoPermissionsException("You are not allowed to interact with this action");
            }
        }
    }
}