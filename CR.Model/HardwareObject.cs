using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class HardwareObject
    {
        [Key]
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int CPUs { get; set; }   //For physical servers this value is known
        public int CPUCores { get; set; } //For physical servers this value is known
        public int Ram { get; set; } //For physical servers this value is known
        public double RackUnitSize { get; set; }
        public double PowerIndex { get; set; }
        public int PortCapacity { get; set; }
        public string ImageSource { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties
        public ICollection<FarmObject> FarmObjects { get; set; }
        public int HardwareTypeId { get; set; }
        public HardwareType HardwareType { get; set; }
    }
}