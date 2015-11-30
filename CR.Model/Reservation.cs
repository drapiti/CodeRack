
using System;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties
        public int NetworkId { get; set; }
        public Network Network { get; set; }
        public int FarmObjectId { get; set; }
        public FarmObject FarmObject { get; set; }
        public int ClusterId { get; set; }
        public Cluster Cluster { get; set; }
    }
}
