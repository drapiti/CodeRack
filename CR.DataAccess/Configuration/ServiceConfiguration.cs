using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    internal class ServiceConfiguration : EntityTypeConfiguration<Service>
    {
        public ServiceConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.Label).HasMaxLength(60).IsRequired();
        }
    }
}