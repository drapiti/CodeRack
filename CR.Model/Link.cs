
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Link
    {
        [Key]
        public int Id { get; set; }
        public string LabelServerEndpoint { get; set; }
        public string LabelTlcEndpoint { get; set; }
        public string LabelPreCabling { get; set; }
        public string LabelJump { get; set; }
        public string MediaType { get; set; }
        public string Speed { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        //Navigation Properties
        public ICollection<Port> Ports { get; set; }
    }
}