using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class PortConfiguration : EntityTypeConfiguration<Port>
    {
        public PortConfiguration()
        {
            Property(one => one.PortNo).HasMaxLength(60).IsRequired();
            Property(one => one.Type).HasMaxLength(60);
            Property(one => one.Interface).HasMaxLength(60);
            Property(one => one.TrunkVlans).HasMaxLength(300);
            Property(one => one.MAC).HasMaxLength(60);
            Property(one => one.WWPN).HasMaxLength(60);
            Property(one => one.CreatedBy).HasMaxLength(60);
            Property(one => one.UpdatedBy).HasMaxLength(60);

            HasRequired(one => one.FarmObject)
                .WithMany(one => one.Ports)
                .HasForeignKey(one => one.FarmObjectId)
                .WillCascadeOnDelete(false);

            HasRequired(one => one.Link)
                .WithMany(one => one.Ports)
                .HasForeignKey(one => one.LinkId)
                .WillCascadeOnDelete(false);

            //HasMany(n => n.Networks)
            //    .WithMany(p => p.Ports)
            //    .Map(x =>
            //    {
            //        x.MapLeftKey("PortId");
            //        x.MapRightKey("NetworkId");
            //        x.ToTable("TrunkPort");
            //    });
        }
    }
}