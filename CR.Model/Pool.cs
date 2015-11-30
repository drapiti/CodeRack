using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CR.Model
{
    public class Pool
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Class { get; set; }
        public int Core { get; set; }
        public string Description { get; set; }

        //Navigation Properties       
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}
