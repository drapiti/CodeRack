using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CR.Model
{
    public class Rack
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        //Navigation Properties      
        public int RoomId { get; set; }
        public Room Room { get; set; }

        public ICollection<FarmObject> FarmObjects { get; set; }
    }
}