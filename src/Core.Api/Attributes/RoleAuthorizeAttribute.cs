using System;
using System.Linq;
using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc.Filters;
using Utils.Enums;
using Utils.Exceptions;
using Utils.Helpers;

namespace Core.Api.Attributes
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
            var hasAuth = context.HttpContext.User.Claims.Any();

            if (!hasAuth)
            {
               throw new AuthenticationException("You have to be authorized to execute the operation");
            }

            if (context.HttpContext.User.Claims.RoleOrFail() < _minimalRole)
            {
                throw new NoPermissionsException("You are not allowed to interact with this action");
            }
        }
    }
}