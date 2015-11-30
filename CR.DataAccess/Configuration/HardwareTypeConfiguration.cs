using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class HardwareTypeConfiguration : EntityTypeConfiguration<HardwareType>
    {
        public HardwareTypeConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
        }
    }
}
