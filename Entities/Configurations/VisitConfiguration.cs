using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PatientManager.Api.Entities.Configurations
{
    public class VisitConfiguration : IEntityTypeConfiguration<Visit>
    {
        public void Configure(EntityTypeBuilder<Visit> builder)
        {
            builder.HasOne(v => v.VisitType)
                .WithMany()
                .HasForeignKey(v => v.VisitTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
