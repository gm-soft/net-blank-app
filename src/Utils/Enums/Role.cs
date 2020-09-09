namespace Utils.Enums
{
    // TODO Maxim: rename to UserRole
    // Values of the access level are given with gaps to allow adding new roles in future.
    public enum Role
    {
        None = 0,

        /// <summary>
        /// Company partner. Temporary we do not use it.
        /// </summary>
        Partner = 1, // 1

        /// <summary>
        /// All employees. Minimal level of access.
        /// </summary>
        Employee = 1 << 3, // 8

        /// <summary>
        /// HR Manager or anyone who has permissions to manage human resources.
        /// </summary>
        HRManager = 1 << 5, // 32

        /// <summary>
        /// CEO of the company.
        /// </summary>
        TopManager = 1 << 8, // 256

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