using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class DestinationTypeConfiguration : EntityTypeConfiguration<DestinationType>
    {
        public DestinationTypeConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired(); 
        }
    }
}