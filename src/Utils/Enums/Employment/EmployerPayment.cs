using System;

namespace Utils.Enums.Employment
{
    [Flags]
    public enum EmployerPayment
    {
        /// <summary>
        /// СО, Социальные отчисления.
        /// </summary>
        SocialPayment = 1,

        /// <summary>
        /// СН, Социальный налог.
        /// </summary>
        SocialTax = 2,

        /// <summary>
        /// ООСМС, Отчисления на ОСМС.
        /// </summary>
        SocialMedicalInsurance = 4,

        /// <summary>
        /// ООСМС, Отчисления на ОСМС за владельца ИП.
        /// </summary>
        SocialMedicalInsuranceForIndividualEntrepreneur = 8
    }
}