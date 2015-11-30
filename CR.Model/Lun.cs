using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Lun
    {
        [Key]
        public int Id { get; set; }
        public string LunLabel { get; set; }
        public int LunScsiId { get; set; }
        public int Size { get; set; }
        public string UidSerial { get; set; }
        public string WWPN { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string VirtualMachineRawDeviceMapped { get; set; }
        public bool IsBootLun { get; set; }
        public string LunScenario { get; set; }

        //Navigation Properties        
        public ICollection<LunMap> LunMaps { get; set; }
        public FarmObject FarmObject { get; set; }
        public int FarmObjectId { get; set; }
    }
}