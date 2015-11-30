using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    internal class VirtualDiskConfiguration : EntityTypeConfiguration<VirtualDisk>
    {
        public VirtualDiskConfiguration()
        {
            Property(one => one.DiskLabel).HasMaxLength(300);
            Property(one => one.Size);
            Property(one => one.CreatedBy).HasMaxLength(30);
            Property(one => one.UpdatedBy).HasMaxLength(30);

            HasRequired(one => one.FarmObject)
                .WithMany(one => one.VirtualDisks)
                .HasForeignKey(one => one.FarmObjectId)
                .WillCascadeOnDelete(false);
        }
    }
}