using System;

namespace Utils.Enums.Employment
{
    [Flags]
    public enum EmployeePayment
    {
        /// <summary>
        /// ОПВ, Обязательный пенсионный взнос
        /// </summary>
        RetiredPayment = 1,

        /// <summary>
        /// ИПН, Индивидуальный подоходный налог
        /// </summary>
        PersonalIncomeTax = 2,

        /// <summary>
        /// ВОСМС, Взнос на ОСМС работником
        /// </summary>
        ObligatedMedicalInsurance = 4
    }
}