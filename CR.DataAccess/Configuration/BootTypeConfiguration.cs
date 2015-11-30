using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class BootTypeConfiguration : EntityTypeConfiguration<BootType>
    {
        public BootTypeConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
        }
    }
}