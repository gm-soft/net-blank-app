namespace Web.MessageBrokers.Messages
{
    public enum ChangeType
    {
        Undefined = 0,

        Create,

        BulkImport,

        Update,

        SoftDelete,

        Remove,

        Restore
    }
}