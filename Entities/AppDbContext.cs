using Microsoft.EntityFrameworkCore;

namespace PatientManager.Api.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {

        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<VisitType> VisitTypes { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<PatientTag> PatientTags { get; set; }
        public object T { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
        }
    }
}
