using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class ServiceLevelConfiguration : EntityTypeConfiguration<ServiceLevel>
    {
        public ServiceLevelConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();

            HasRequired(one => one.Service)
            .WithMany(one => one.ServiceLevels)
            .HasForeignKey(one => one.ServiceId)
            .WillCascadeOnDelete(false);
        }
    }
}