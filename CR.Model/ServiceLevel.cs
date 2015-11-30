using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class ServiceLevel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int No_Copy { get; set; }
        public int Type { get; set; }
        public string Usage { get; set; }
        public string DataStore { get; set; }

        //Navigation Properties
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}