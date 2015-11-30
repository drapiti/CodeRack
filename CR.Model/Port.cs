using System;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Port
    {
        //Primitive Properties   
        [Key]
        public int Id { get; set; }
        public string PortNo { get; set; }
        public string Interface { get; set; }
        public string TrunkVlans { get; set; }  //Access or Trunk
        public string Type { get; set; }  //Storage or Network
        public string WWPN { get; set; }
        public string MAC { get; set; }
        public string State { get; set; } // Up or Down
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties        
        public int FarmObjectId { get; set; }
        public FarmObject FarmObject { get; set; }        
        public int LinkId { get; set; }
        public Link Link { get; set; }
    }
}