using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class LinkConfiguration : EntityTypeConfiguration<Link>
    {
        public LinkConfiguration()
        {
            Property(one => one.LabelServerEndpoint).HasMaxLength(300).IsRequired();
            Property(one => one.LabelTlcEndpoint).HasMaxLength(300).IsRequired();
            Property(one => one.LabelPreCabling).HasMaxLength(300).IsRequired();
            Property(one => one.LabelJump).HasMaxLength(300).IsRequired();
            Property(one => one.MediaType).HasMaxLength(60).IsRequired();
            Property(one => one.Speed).HasMaxLength(60).IsRequired();
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();
        }
    }
}