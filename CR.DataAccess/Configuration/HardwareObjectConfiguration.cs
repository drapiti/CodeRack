using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class HardwareObjectConfiguration : EntityTypeConfiguration<HardwareObject>
    {
        public HardwareObjectConfiguration()
        {
            Property(one => one.Brand).HasMaxLength(60).IsRequired();
            Property(one => one.Model).HasMaxLength(60).IsRequired();
            Property(one => one.RackUnitSize).IsRequired();
            Property(one => one.PowerIndex).IsRequired();
            Property(one => one.PortCapacity).IsRequired();
            Property(one => one.ImageSource).HasMaxLength(60);
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();

            HasRequired(one => one.HardwareType)
              .WithMany(one => one.HardwareObjects)
              .HasForeignKey(one => one.HardwareTypeId)
              .WillCascadeOnDelete(false);
        }
    }
}