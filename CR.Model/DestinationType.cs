using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class DestinationType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }    //Application Server or Database Server

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}
