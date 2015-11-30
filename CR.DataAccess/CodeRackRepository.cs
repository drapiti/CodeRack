using System;
using System.Linq;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using CR.Model;
using OperatingSystem = CR.Model.OperatingSystem;

namespace CR.DataAccess
{
    /// <summary>
    ///     Repository (a "Unit of Work" really) of CodeRack models.
    /// </summary>
    public class CodeRackRepository
    {   
        private readonly EFContextProvider<CodeRackDbContext> _contextProvider = new EFContextProvider<CodeRackDbContext>();

        private CodeRackDbContext Context { get { return _contextProvider.Context; } }
   
        public string Metadata
        {
            get { return _contextProvider.Metadata(); }
        }

        public SaveResult SaveChanges(JObject saveBundle)
        {            
            return _contextProvider.SaveChanges(saveBundle);
        }

        public IQueryable<BkPolicyVM> BkPolicyVMs
        {
            get { return Context.BkPolicyVMs; }
        }

        public IQueryable<BkPolicyPM> BkPolicyPMs
        {
            get { return Context.BkPolicyPMs; }
        }

        public IQueryable<BootType> BootTypes
        {
            get { return Context.BootTypes; }
        }

        public IQueryable<Pool> Pools
        {
            get { return Context.Pools; }
        }

        public IQueryable<Cluster> Clusters
        {
            get { return Context.Clusters; }
        }

        public IQueryable<DestinationType> DestinationTypes
        {
            get { return Context.DestinationTypes; }
        }

        public IQueryable<FarmObject> FarmObjects
        {
            get { return Context.FarmObjects; }
        }

        public IQueryable<HardwareObject> HardwareObjects
        {
            get { return Context.HardwareObjects; }
        }

        public IQueryable<HardwareType> HardwareTypes
        {
            get { return Context.HardwareTypes; }
        }

        public IQueryable<Link> Links
        {
            get { return Context.Links; }
        }

        public IQueryable<OperatingSystem> OperatingSystems
        {
            get { return Context.OperatingSystems; }
        }

        public IQueryable<Service> Services
        {
            get { return Context.Services; }
        }

        public IQueryable<Network> Networks
        {
            get { return Context.Networks; }
        }

        public IQueryable<Reservation> Reservations
        {
            get { return Context.Reservations; }
        }   

        public IQueryable<ServiceLevel> ServiceLevels
        {
            get { return Context.ServiceLevels; }
        }

        public IQueryable<Room> Rooms
        {
            get { return Context.Rooms; }
        }

        public IQueryable<Rack> Racks
        {
            get { return Context.Racks; }
        }

        public IQueryable<Port> Ports
        {
            get { return Context.Ports; }
        }

        public IQueryable<Lun> Luns
        {
            get { return Context.Luns; }
        }

        //public IQueryable<LunMap> LunMaps
        //{
        //    get { return Context.LunMaps; }
        //}

        public IQueryable<VirtualDisk> VirtualDisks
        {
            get { return Context.VirtualDisks; }
        }

        public IQueryable<ParentObject> ParentObjects
        {
            get { return Context.ParentObjects; }
        }

    }
}