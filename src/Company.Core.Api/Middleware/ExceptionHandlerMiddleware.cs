using System;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Utils.Exceptions;

namespace Company.Core.Api.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private const string DefaultServerErrorMessage = "Internal Server Error";

        private readonly RequestDelegate _next;

        private readonly Dictionary<Type, int> _statusCodeConversion = new Dictionary<Type, int>()
        {
            { typeof(AuthenticationException), StatusCodes.Status401Unauthorized },
            { typeof(NoPermissionsException), StatusCodes.Status403Forbidden },
            { typeof(ResourceNotFoundException), StatusCodes.Status404NotFound },
            { typeof(BadRequestException), StatusCodes.Status400BadRequest },
            { typeof(InvalidOperationException), StatusCodes.Status400BadRequest },
            { typeof(DbUpdateConcurrencyException), StatusCodes.Status409Conflict }
        };

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        // We have to use UseAsyncSuffix rule disable because the method Invoke has to be named 'as is' without any suffixes.
        // But some pipelines checks the method for the rule suitability, and that's why the pipeline makes a build failed.
        // To avoid this situation, we use pragma warning disable here.
#pragma warning disable UseAsyncSuffix // Use Async suffix
        public async Task Invoke(HttpContext context)
#pragma warning restore UseAsyncSuffix // Use Async suffix
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                await HandleExceptionAsync(context, e);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = StatusCodes.Status500InternalServerError;
            string message = null;

            if (_statusCodeConversion.TryGetValue(exception.GetType(), out int status))
            {
                statusCode = status;
                message = exception.Message;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var errorContent = new ErrorDetails
            {
                StatusCode = statusCode,
                Message = message ?? DefaultServerErrorMessage
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(errorContent));
        }
    }
}