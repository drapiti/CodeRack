using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class OperatingSystem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Tenant { get; set; }

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
        public ICollection<Blueprint> Blueprints { get; set; }
    }
}