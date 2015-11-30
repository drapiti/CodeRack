using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class BkPolicyVM
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public string Description { get; set; }

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}