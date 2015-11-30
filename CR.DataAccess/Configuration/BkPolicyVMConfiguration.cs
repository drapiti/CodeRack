using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class BkPolicyVMConfiguration : EntityTypeConfiguration<BkPolicyVM>
    {
        public BkPolicyVMConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.Description).HasMaxLength(300); 
        }
    }
}