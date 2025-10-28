using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PatientManager.Api.Entities.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasMany(p => p.Visits)
                .WithOne(v => v.Patient)
                .HasForeignKey(v => v.PatientId);

            builder.HasMany(p => p.PatientTags)
                .WithMany(t => t.Patients);


            builder.Property(e => e.PhoneNumber)
                .HasColumnType("char(9)");

            builder.Property(e => e.Pesel)
                .HasColumnType("char(11)");
        }
    }
}
