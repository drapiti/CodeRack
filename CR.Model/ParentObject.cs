using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class ParentObject
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int MaxChildren { get; set; }  
        //Navigation Properties 
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}
