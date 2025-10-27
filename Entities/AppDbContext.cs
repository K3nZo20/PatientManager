using Microsoft.EntityFrameworkCore;

namespace PatientManager.Api.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {

        }

        public DbSet<Patient> Patients { get; set; }
    }
}
