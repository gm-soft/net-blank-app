using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Utils.Authorization;
using Utils.Enums;
using Utils.Helpers;

namespace PC.Domain.Services.Claims
{
    public class ClaimsUser
    {
        private readonly bool _throwExIfNotFound;

        private readonly ClaimsPrincipal _principal;

        private string _firstName;
        private string _lastName;
        private string _userName;
        private long? _id;
        private string _email;
        private Role? _role;

        private bool _gotFunctionManagerId;
        private long? _functionManagerId;

        public ClaimsUser(ClaimsPrincipal principal, bool throwExIfNotFound = false)
        {
            _principal = principal ?? throw new ArgumentNullException(paramName: nameof(principal));
            _throwExIfNotFound = throwExIfNotFound;
        }

        public IEnumerable<Claim> Claims()
        {
            return _principal.Claims;
        }

        public bool HasAuth
        {
            get
            {
                if (!_principal.Claims.Any())
                {
                    return false;
                }

                return FirstName != null && LastName != null && UserName != null;
            }
        }

        public long Id
        {
            get
            {
                if (!_id.HasValue)
                {
                    string idAsString = _principal.GetClaimValue(ClaimTypes.NameIdentifier, _throwExIfNotFound);

                    _id = idAsString == null || !long.TryParse(idAsString, out long userId)
                        ? default(long)
                        : userId;
                }

                return _id.Value;
            }
        }

        public string FirstName
        {
            get
            {
                if (_firstName == null)
                {
                    _firstName = _principal.GetClaimValue(ClaimTypes.GivenName, _throwExIfNotFound);
                }

                return _firstName;
            }
        }

        public string LastName
        {
            get
            {
                if (_lastName == null)
                {
                    _lastName = _principal.GetClaimValue(ClaimTypes.Surname, _throwExIfNotFound);
                }

                return _lastName;
            }
        }

        public string UserName
        {
            get
            {
                if (_userName == null)
                {
                    _userName = _principal.GetClaimValue(CustomClaimTypes.Username, _throwExIfNotFound);
                }

                return _userName;
            }
        }

        public string Email
        {
            get
            {
                if (_email == null)
                {
                    _email = _principal.GetClaimValue(ClaimTypes.Email, _throwExIfNotFound);
                }

                return _email;
            }
        }

        public long? FunctionManagerId
        {
            get
            {
                if (!_gotFunctionManagerId)
                {
                    string idAsString = _principal.GetClaimValue(CustomClaimTypes.FunctionManagerId, _throwExIfNotFound);

                    _functionManagerId = idAsString == null || !long.TryParse(idAsString, out long functionalManagerId)
                        ? default(long?)
                        : functionalManagerId;

                    _gotFunctionManagerId = true;
                }

                return _functionManagerId;
            }
        }

        public Role Role
        {
            get
            {
                if (_role == null)
                {
                    _role = _principal.Role();
                }

                return _role.Value;
            }
        }
    }
}