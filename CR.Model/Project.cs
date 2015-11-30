using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProjectCode { get; set; }
        public string WBE { get; set; }
        public DateTime DueDateNonProduction { get; set; }
        public DateTime DueDateProduction { get; set; }
        public string Tenant { get; set; }
        public string State { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        //Navigation Properties 
        public ICollection<Request> Requests { get; set; }
    }
}
