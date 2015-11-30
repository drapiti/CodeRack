using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using CR.DataAccess;
using CR.Model;
using Newtonsoft.Json.Linq;
using OperatingSystem = CR.Model.OperatingSystem;
using System.Collections.Generic;

namespace CR.Web.Controllers
{
    [Authorize]
    [BreezeController]
    public class BreezeController : ApiController
    {
        // Todo: inject via an interface rather than "new" the concrete class
        private readonly CodeRackRepository _repository = new CodeRackRepository();
   
        [HttpGet]
        public string Metadata()
        {
            return _repository.Metadata;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {           
            return _repository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<FarmObject> FarmObjects()
        {
            return _repository.FarmObjects;
        }

        [HttpGet]
        public IQueryable<Link> Links()
        {
            return _repository.Links;
        }

        [HttpGet]
        public IQueryable<Lun> Luns()
        {
            return _repository.Luns;
        }

        //[HttpGet]
        //public IQueryable<LunMap> LunMaps()
        //{
        //    return _repository.LunMaps;
        //}

        [HttpGet]
        public IQueryable<VirtualDisk> VirtualDisks()
        {
            return _repository.VirtualDisks;
        }

        [HttpGet]
        public IQueryable<Network> Networks()
        {
            return _repository.Networks;
        }

        [HttpGet]
        public IQueryable<HardwareObject> HardwareObjects()
        {
            return _repository.HardwareObjects;
        }

        [HttpGet]
        public IQueryable<Port> Ports()
        {
            return _repository.Ports;
        }
          
        [HttpGet]
        public IQueryable<Reservation> Reservations()
        {
            return _repository.Reservations;
        }
            
        /// <summary>
        ///     Query returing a 1-element array with a lookups object whose
        ///     properties are all Rooms, Tracks, and TimeSlots.
        /// </summary>
        /// <returns>
        ///     Returns one object, not an IQueryable,
        ///     whose properties are "rooms", "environments", "operating systems" ecc.
        ///     The items arrive as arrays.
        /// </returns>
        [HttpGet]
        public object Lookups()
        {
            IQueryable<Cluster> clusters = _repository.Clusters;
            IQueryable<BootType> bootTypes = _repository.BootTypes;
            IQueryable<Pool> pools = _repository.Pools;
            IQueryable<BkPolicyVM> bkPolicyVMs = _repository.BkPolicyVMs;
            IQueryable<BkPolicyPM> bkPolicyPMs = _repository.BkPolicyPMs;
            IQueryable<DestinationType> destinationTypes = _repository.DestinationTypes;
            IQueryable<FarmObject> farmObjects = _repository.FarmObjects;
            IQueryable<Link> links = _repository.Links;
            IQueryable<HardwareObject> hardwareObjects = _repository.HardwareObjects;
            IQueryable<HardwareType> hardwareTypes = _repository.HardwareTypes;
            IQueryable<ParentObject> parentObjects = _repository.ParentObjects;
            IQueryable<OperatingSystem> operatingSystems = _repository.OperatingSystems;
            IQueryable<Network> networks = _repository.Networks;
            IQueryable<Rack> racks = _repository.Racks;
            IQueryable<Room> rooms = _repository.Rooms;
            IQueryable<ServiceLevel> serviceLevels = _repository.ServiceLevels;
            IQueryable<Service> services = _repository.Services;
                                    
            return new
            {
                clusters,
                bkPolicyVMs,
                bkPolicyPMs,
                bootTypes,
                pools,
                destinationTypes,    
                farmObjects,
                links,
                networks,
                hardwareObjects,
                hardwareTypes,
                parentObjects,
                operatingSystems,
                racks, 
                rooms,
                serviceLevels, 
                services                                                  
            };
        }
    }
}