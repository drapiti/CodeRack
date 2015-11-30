using System.Data.Entity.ModelConfiguration;
using CR.Model;

namespace CR.DataAccess.Configuration
{
    public class BlueprintConfiguration : EntityTypeConfiguration<Blueprint>
    {
        public BlueprintConfiguration()
        {
            Property(one => one.Name).HasMaxLength(60).IsRequired();
            Property(one => one.CPU).HasMaxLength(60).IsRequired();
            Property(one => one.Memory).HasMaxLength(60).IsRequired();
            Property(one => one.Storage).HasMaxLength(60).IsRequired();
            Property(one => one.CreatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.UpdatedBy).HasMaxLength(60).IsRequired();
            Property(one => one.Description).HasMaxLength(300);

            //HasRequired(one => one.Service)
            //    .WithMany(one => one.Blueprints)
            //    .HasForeignKey(one => one.ServiceId)
            //    .WillCascadeOnDelete(false);

            HasRequired(one => one.OperatingSystem)
                .WithMany(one => one.Blueprints)
                .HasForeignKey(one => one.OperatingSystemId)
                .WillCascadeOnDelete(false);
        }
    }
}
