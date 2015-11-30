using CR.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CR.DataAccess.Configuration
{
    public class RequestConfiguration : EntityTypeConfiguration<Request>
    {
        public RequestConfiguration()
        {
            Property(one => one.RequestId).HasMaxLength(60).IsRequired();

            HasRequired(one => one.Project)
                .WithMany(one => one.Requests)
                .HasForeignKey(one => one.ProjectId)
                .WillCascadeOnDelete(false);        
        }
    }
}
