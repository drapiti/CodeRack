using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    internal class LunMapConfiguration : EntityTypeConfiguration<LunMap>
    {
        public LunMapConfiguration()
        {
            HasRequired(one => one.FarmObject)
                .WithMany(one => one.LunMaps)
                .HasForeignKey(one => one.FarmObjectId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.Lun)
                .WithMany(one => one.LunMaps)
                .HasForeignKey(one => one.LunId)
                .WillCascadeOnDelete(true);

        }
    }
}