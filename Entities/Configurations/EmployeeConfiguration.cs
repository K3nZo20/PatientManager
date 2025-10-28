using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PatientManager.Api.Entities.Configurations
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.HasMany(e => e.Visits)
                .WithOne(v => v.Employee)
                .HasForeignKey(v => v.EmployeeId);

            builder.Property(e => e.PhoneNumber)
                .HasColumnType("char(9)");
        }
    }
}
