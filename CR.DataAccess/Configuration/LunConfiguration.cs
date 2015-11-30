using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    internal class LunConfiguration : EntityTypeConfiguration<Lun>
    {
        public LunConfiguration()
        {
            Property(one => one.LunLabel).HasMaxLength(300);
            Property(one => one.Size).IsRequired();
            Property(one => one.UidSerial).HasMaxLength(60);
            Property(one => one.WWPN).HasMaxLength(60);
            Property(one => one.CreatedBy).HasMaxLength(60);
            Property(one => one.UpdatedBy).HasMaxLength(60);
            Property(one => one.VirtualMachineRawDeviceMapped).HasMaxLength(300);

            HasRequired(one => one.FarmObject)
                .WithMany(one => one.Luns)
                .HasForeignKey(one => one.FarmObjectId)
                .WillCascadeOnDelete(false);
        }
    }
}