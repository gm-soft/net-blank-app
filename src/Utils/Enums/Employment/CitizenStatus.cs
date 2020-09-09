using System;

namespace Utils.Enums.Employment
{
    [Flags]
    public enum CitizenStatus
    {
        /// <summary>
        /// KZ citizen.
        /// </summary>
        Resident = 1,

        /// <summary>
        /// Eurasian Economic Union citizen (Russia, Belarus, etc).
        /// </summary>
        FromEEU = 2,

        /// <summary>
        /// The citizen with a KZ residence permit from another country.
        /// </summary>
        ResidencePermit = 4,

        /// <summary>
        /// The citizen without a KZ residence permit from another country.
        /// </summary>
        NoResidencePermit = 8,

        /// <summary>
        /// A person without any citizen status
        /// </summary>
        NoCitizenStatus = 16,

        All = Resident | FromEEU | ResidencePermit | NoResidencePermit | NoCitizenStatus
    }
}