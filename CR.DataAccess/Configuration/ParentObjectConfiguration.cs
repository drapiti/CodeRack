using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class ParentObjectConfiguration : EntityTypeConfiguration<ParentObject>
    {
        public ParentObjectConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.MaxChildren).IsRequired();
        }
    }
}
