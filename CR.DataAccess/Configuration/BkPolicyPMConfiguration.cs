using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class BkPolicyPMConfiguration : EntityTypeConfiguration<BkPolicyPM>
    {
        public BkPolicyPMConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.Description).HasMaxLength(300); 
        }
    }
}