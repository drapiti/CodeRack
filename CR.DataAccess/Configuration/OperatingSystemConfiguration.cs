using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class OperatingSystemConfiguration : EntityTypeConfiguration<OperatingSystem>
    {
        public OperatingSystemConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
        }
    }
}