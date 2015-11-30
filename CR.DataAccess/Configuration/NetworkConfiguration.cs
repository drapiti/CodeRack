using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class NetworkConfiguration : EntityTypeConfiguration<Network>
    {
        public NetworkConfiguration()
        {
            Property(one => one.Address).HasMaxLength(18).IsRequired();
            Property(one => one.Subnet).HasMaxLength(18).IsRequired();
            Property(one => one.Gateway).HasMaxLength(18).IsRequired();
            Property(one => one.Vlan).IsRequired();
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.Description).HasMaxLength(300);

            HasRequired(one => one.Service)
            .WithMany(one => one.Networks)
            .HasForeignKey(one => one.ServiceId)
            .WillCascadeOnDelete(false);
        }
    }
}