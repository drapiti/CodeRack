using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CR.Model
{
    public class LunMap
    {
        [Key]
        public int Id { get; set; }

        //Navigation Properties    
        public int FarmObjectId { get; set; }
        public FarmObject FarmObject { get; set; }
        public int LunId { get; set; }
        public Lun Lun { get; set; }

    }
}
