using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class RackConfiguration : EntityTypeConfiguration<Rack>
    {
        public RackConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();

            HasRequired(one => one.Room)
                .WithMany(one => one.Racks)
                .HasForeignKey(one => one.RoomId)
                .WillCascadeOnDelete(false);
        }
    }
}