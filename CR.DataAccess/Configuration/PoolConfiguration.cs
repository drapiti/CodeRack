using CR.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CR.DataAccess.Configuration
{
    public class PoolConfiguration : EntityTypeConfiguration<Pool>
    {
        public PoolConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
        }
    }
}
