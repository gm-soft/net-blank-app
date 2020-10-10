using System;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Utils.Exceptions;

namespace PC.Domain.Middlewares
{
    public class ExceptionHandlerMiddleware : IMiddleware
    {
        private const string DefaultServerErrorMessage = "Internal Server Error";

        private readonly RequestDelegate _next;

        private readonly Dictionary<Type, int> _statusCodeConversion = new Dictionary<Type, int>()
        {
            { typeof(AuthenticationException), StatusCodes.Status401Unauthorized },
            { typeof(NoPermissionsException), StatusCodes.Status403Forbidden },
            { typeof(ResourceNotFoundException), StatusCodes.Status404NotFound },
            { typeof(BadAssException), StatusCodes.Status400BadRequest },
            { typeof(InvalidOperationException), StatusCodes.Status400BadRequest },
            { typeof(DbUpdateConcurrencyException), StatusCodes.Status409Conflict }
        };

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
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

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
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

            await context.Response.WriteAsync(JsonConvert.SerializeObject(new ErrorDetails
            {
                StatusCode = statusCode,
                Message = message ?? DefaultServerErrorMessage
            }));
        }
    }
}