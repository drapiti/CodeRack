using System.Data.Entity.ModelConfiguration;

using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class ReservationConfiguration : EntityTypeConfiguration<Reservation>
    {
        public ReservationConfiguration()
        {
            Property(one => one.Address).HasMaxLength(18).IsRequired();
            Property(one => one.Description).HasMaxLength(300);
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();

            HasRequired(one => one.Network)
            .WithMany(one => one.Reservations)
            .HasForeignKey(one => one.NetworkId)
            .WillCascadeOnDelete(false);

            HasRequired(one => one.FarmObject)
            .WithMany(one => one.Reservations)
            .HasForeignKey(one => one.FarmObjectId)
            .WillCascadeOnDelete(false);

            HasRequired(one => one.Cluster)
            .WithMany(one => one.Reservations)
            .HasForeignKey(one => one.ClusterId)
            .WillCascadeOnDelete(false);

        }
    }
}
