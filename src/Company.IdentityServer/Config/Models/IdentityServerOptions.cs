using System;
using Utils.Helpers;

namespace Company.IdentityServer.Config.Models
{
    public class IdentityServerOptions
    {
        public string LoginUrl { get; set; }

        public string LogoutUrl { get; set; }

        public string LoginReturnUrlParameter { get; set; }

        public bool RaiseErrorEvents { get; set; }

        public bool RaiseFailureEvents { get; set; }

        public bool RaiseInformationEvents { get; set; }

        public bool RaiseSuccessEvents { get; set; }

        public IdentityServerOptions ThrowIfInvalid()
        {
            if (!Valid())
            {
                throw new InvalidOperationException($"{nameof(IdentityServerOptions)} is invalid");
            }

            return this;
        }

        private bool Valid()
        {
            return !LoginUrl.NullOrEmpty() &&
                   !LogoutUrl.NullOrEmpty() &&
                   !LoginReturnUrlParameter.NullOrEmpty();
        }
    }
}