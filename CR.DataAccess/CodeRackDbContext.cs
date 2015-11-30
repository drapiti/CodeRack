using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using CR.DataAccess.Configuration;
using CR.Model;
using OperatingSystem = CR.Model.OperatingSystem;

namespace CR.DataAccess
{
    public class CodeRackDbContext : DbContext
    {
        public CodeRackDbContext()
            : base(nameOrConnectionString: "CodeRack")
        {
            // Disable proxy creation and lazy loading; not wanted in this service context.
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }
       
        static CodeRackDbContext()
        {
            Database.SetInitializer(new CodeRackDbInitializer());
        }

        public DbSet<HardwareObject> HardwareObjects { get; set; }
        public DbSet<HardwareType> HardwareTypes { get; set; }
        public DbSet<DestinationType> DestinationTypes { get; set; }
        public DbSet<ParentObject> ParentObjects { get; set; }
        public DbSet<BootType> BootTypes { get; set; }
        public DbSet<Cluster> Clusters { get; set; }
        public DbSet<OperatingSystem> OperatingSystems { get; set; }
        public DbSet<Port> Ports { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceLevel> ServiceLevels { get; set; }        
        public DbSet<Network> Networks { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Link> Links { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Rack> Racks { get; set; }
        public DbSet<Lun> Luns { get; set; }
        public DbSet<LunMap> LunMaps { get; set; }
        public DbSet<VirtualDisk> VirtualDisks { get; set; }
        public DbSet<FarmObject> FarmObjects { get; set; }
        public DbSet<BkPolicyVM> BkPolicyVMs { get; set; }
        public DbSet<BkPolicyPM> BkPolicyPMs { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Blueprint> Blueprints { get; set; }
        public DbSet<Pool> Pools { get; set; }
        public DbSet<Request> Requests { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Use singular table names
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Configurations.Add(new BkPolicyVMConfiguration());
            modelBuilder.Configurations.Add(new BkPolicyPMConfiguration());
            modelBuilder.Configurations.Add(new OperatingSystemConfiguration());
            modelBuilder.Configurations.Add(new PortConfiguration());
            modelBuilder.Configurations.Add(new BootTypeConfiguration());
            modelBuilder.Configurations.Add(new ClusterConfiguration());
            modelBuilder.Configurations.Add(new DestinationTypeConfiguration());
            modelBuilder.Configurations.Add(new ServiceLevelConfiguration());
            modelBuilder.Configurations.Add(new ServiceConfiguration());
            modelBuilder.Configurations.Add(new HardwareObjectConfiguration());
            modelBuilder.Configurations.Add(new HardwareTypeConfiguration());
            modelBuilder.Configurations.Add(new ParentObjectConfiguration());
            modelBuilder.Configurations.Add(new NetworkConfiguration());
            modelBuilder.Configurations.Add(new ReservationConfiguration());
            modelBuilder.Configurations.Add(new LinkConfiguration());            
            modelBuilder.Configurations.Add(new LunConfiguration());
            modelBuilder.Configurations.Add(new LunMapConfiguration());
            modelBuilder.Configurations.Add(new VirtualDiskConfiguration());
            modelBuilder.Configurations.Add(new RoomConfiguration());
            modelBuilder.Configurations.Add(new RackConfiguration());           
            modelBuilder.Configurations.Add(new FarmObjectConfiguration());
            modelBuilder.Configurations.Add(new ProjectConfiguration());
            modelBuilder.Configurations.Add(new BlueprintConfiguration());
            modelBuilder.Configurations.Add(new PoolConfiguration());
            modelBuilder.Configurations.Add(new RequestConfiguration());
        }      
    }
}