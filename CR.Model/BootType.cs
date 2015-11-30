using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class BootType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}