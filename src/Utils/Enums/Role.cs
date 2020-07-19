namespace Utils.Enums
{
    // TODO Maxim: rename to UserRole
    // Values of the access level are given with gaps to allow adding new roles in future.
    public enum Role
    {
        None = 0,

        /// <summary>
        /// All employees. Minimal level of access.
        /// </summary>
        Employee = 1 << 0,

        /// <summary>
        /// HR Manager or anyone who has permissions to manage human resources.
        /// </summary>
        HRManager = 1 << 1,

        /// <summary>
        /// CEO of the company.
        /// </summary>
        TopManager = 1 << 7, // 128

        /// <summary>
        /// 'Super user' of the system.
        /// </summary>
        SystemAdministrator = 1 << 9, // 512

        /// <summary>
        /// The system or any background task.
        /// </summary>
        System = 1 << 10 // 1024
    }
}