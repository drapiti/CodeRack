using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class BkPolicyPM
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public string Description { get; set; }
        public string Retention { get; set; }
        public string Frequency { get; set; }

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}