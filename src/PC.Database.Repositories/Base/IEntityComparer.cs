using PC.Database.Models.BaseModels;
using PC.Models;

namespace PC.Database.Repositories.Base
{
    public interface IEntityComparer<in TBusinessEntity, in TDbEntity>
        where TBusinessEntity : BaseModel
        where TDbEntity : DbBaseModel
    {
        bool AreEqual(TBusinessEntity businessEntity, TDbEntity databaseEntity);
    }
}