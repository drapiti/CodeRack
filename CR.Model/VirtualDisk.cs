using System;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class VirtualDisk
    {
        [Key]
        public int Id { get; set; }
        public string DiskLabel { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties        
        public int FarmObjectId { get; set; }
        public FarmObject FarmObject { get; set; }
    }
}