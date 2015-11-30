using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class FarmObjectConfiguration : EntityTypeConfiguration<FarmObject>
    {
        public FarmObjectConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.Serial).HasMaxLength(60).IsRequired();
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.Notes).HasMaxLength(300);
            Property(one => one.BkNotes).HasMaxLength(300);

            HasRequired(one => one.BootType)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.BootTypeId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.HardwareObject)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.HardwareObjectId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.ParentObject)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.ParentObjectId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.Rack)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.RackId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.ServiceLevel)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.ServiceLevelId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.OperatingSystem)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.OperatingSystemId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.Cluster)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.ClusterId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.DestinationType)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.DestinationTypeId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.BkPolicyVM)
                .WithMany(one => one.FarmObjects)
                .HasForeignKey(one => one.BkPolicyVMId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.Pool)
              .WithMany(one => one.FarmObjects)
              .HasForeignKey(one => one.PoolId)
              .WillCascadeOnDelete(false);
        }
    }
}