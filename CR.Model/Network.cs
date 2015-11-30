using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Network
    {
        [Key]
        public int Id { get; set; }

        public string Address { get; set; }
        public string Subnet { get; set; }
        public string Gateway { get; set; }
        public int Vlan { get; set; }
        public string Description { get; set; }
        public string NetworkPath { get; set; }  //VRA dependency
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties
        //public ICollection<Port> Ports { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }
}