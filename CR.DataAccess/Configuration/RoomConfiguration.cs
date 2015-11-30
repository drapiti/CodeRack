using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    class RoomConfiguration : EntityTypeConfiguration<Room>
    {
        public RoomConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();    
        }       
    }
}
