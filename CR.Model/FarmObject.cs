using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class FarmObject
    {
        //Primitive Properties
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Serial { get; set; }
        public int CPUs { get; set; }
        public int CPUCores { get; set; }
        public int Ram { get; set; }
        public int Nic { get; set; }
        public int EntitledCapacity { get; set; } //LPAR parameter
        public string ServiceProfile { get; set; }
        public string NodePosition { get; set; } //Position Inside chassis
        public string Notes { get; set; }
        public bool BkBareMetalRestore { get; set; }
        public string BkNotes { get; set; } //Transaction Log Info if present hourly backups ecc
        public string BkFSPaths { get; set; } 
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string State { get; set; }

        //Navigation Properties       
        public ICollection<Port> Ports { get; set; }
        public ICollection<Lun> Luns { get; set; }
        public ICollection<LunMap> LunMaps { get; set; }
        public ICollection<VirtualDisk> VirtualDisks { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
        public int BkPolicyVMId { get; set; }
        public BkPolicyVM BkPolicyVM { get; set; }
        public int BkPolicyPMId { get; set; }
        public BkPolicyPM BkPolicyPM { get; set; }
        public int BootTypeId { get; set; }
        public BootType BootType { get; set; }
        public int ServiceLevelId { get; set; }
        public ServiceLevel ServiceLevel { get; set; }
        public int OperatingSystemId { get; set; }
        public OperatingSystem OperatingSystem { get; set; }
        public int HardwareObjectId { get; set; }
        public HardwareObject HardwareObject { get; set; }
        public int RackId { get; set; }
        public Rack Rack { get; set; }
        public int ParentObjectId { get; set; }
        public ParentObject ParentObject { get; set; }
        public int ClusterId { get; set; }
        public Cluster Cluster { get; set; }
        public int DestinationTypeId { get; set; }
        public DestinationType DestinationType { get; set; }
        public int PoolId { get; set; }
        public Pool Pool { get; set; }
    }
}