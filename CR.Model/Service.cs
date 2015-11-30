using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Service
    {
        //Primitive Properties
        [Key]
        public int Id { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
        public string Environment { get; set; }
        public string Segment { get; set; }

        //Navigation Properties
        public ICollection<Network> Networks { get; set; }
        public ICollection<ServiceLevel> ServiceLevels { get; set; }
    }
}