using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Blueprint
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string CPU { get; set; }
        public string Memory { get; set; }
        public string Storage { get; set; } 
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Tenant { get; set; }

        //Navigation Properties 
        public int OperatingSystemId { get; set; }
        public OperatingSystem OperatingSystem { get; set; }
    }
}
