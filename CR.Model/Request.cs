using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CR.Model
{
    public class Request
    {
        [Key]
        public int Id { get; set; }
        public string RequestId { get; set; }
        public string Element { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime CompletedDate { get; set; }   
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties 
        public Project Project { get; set; }
        public int ProjectId { get; set; }
    }
}
