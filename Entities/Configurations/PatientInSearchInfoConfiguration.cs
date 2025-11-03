using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PatientManager.Api.Entities.ViewModels;

namespace PatientManager.Api.Entities.Configurations
{
    public class PatientInSearchInfoConfiguration : IEntityTypeConfiguration<PatientInSearchInfo>
    {
        public void Configure(EntityTypeBuilder<PatientInSearchInfo> builder)
        {
            builder.ToView("View_PatientInSearchInfos");
            builder.HasNoKey();
        }
    }
}
