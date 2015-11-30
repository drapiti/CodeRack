using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Site { get; set; }
        public string SdrsGroup { get; set; }
        public ICollection<Rack> Racks { get; set; }
    }
}