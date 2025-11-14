using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;

namespace PatientManager.Api.Services
{
    public class VisitService : IVisitService
    {
        private readonly AppDbContext _context;
        public VisitService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Visit>> GetAllPatientVisitsAsync(Guid patientId)
        {
            return await _context.Visits
                .Include(v => v.Patient)
                .Include(v => v.Employee)
                .Include(v => v.VisitType)
                .Where(v => v.PatientId == patientId)
                .OrderByDescending(v => v.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Visit>> GetVisitsByDateAsync(DateTime date)
        {
            var startOfDay = date.Date;
            var endOfDay = date.Date.AddDays(1);

            var visits = await _context.Visits
                .Include(v => v.Patient)
                .Include(v => v.Employee)
                .Include(v => v.VisitType)
                .Where(v => v.StartTime >= startOfDay && v.EndTime < endOfDay)
                .OrderBy(v => v.StartTime)
                .ToListAsync();

            return visits;
        }

        public async Task<IEnumerable<Visit>> GetVisitsByEmployeeAsync(Guid employeeId, DateTime date)
        {
            var startOfDay = date.Date;
            var endOfDay = date.Date.AddDays(1);

            return await _context.Visits
                .Include(v => v.Employee)
                .Include(v => v.VisitType)
                .Include(v => v.Patient)
                .Where(v => v.EmployeeId == employeeId && v.StartTime >= startOfDay && v.EndTime < endOfDay)
                .OrderByDescending(v => v.StartTime)
                .ToListAsync();
        }

        public async Task<Visit> CreateAsync(Visit visit)
        {
            if (!_context.Patients.Any(p => p.Id == visit.PatientId))
                throw new Exception("Pacjent nie istnieje.");

            if (!_context.Employees.Any(e => e.Id == visit.EmployeeId))
                throw new Exception("Pracownik nie istnieje.");

            bool overlap = await _context.Visits.AnyAsync(v =>
                    v.EmployeeId == visit.EmployeeId &&
                    v.StartTime == visit.StartTime);

            if (overlap)
                throw new Exception("Pracownik ma już wizytę w tym terminie.");

            visit.Id = Guid.NewGuid();
            _context.Visits.Add(visit);
            await _context.SaveChangesAsync();
            return visit;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var visit = await GetByIdAsync(id);
            if (visit == null) return false;

            _context.Visits.Remove(visit);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Visit?> GetByIdAsync(Guid id)
        {
            return await _context.Visits
                .Include(v => v.Patient)
                .Include(v => v.Employee)
                .Include(v => v.VisitType)
                .FirstOrDefaultAsync(v => v.Id == id);

        }

        public async Task<bool> UpdateAsync(Guid id, Visit visit)
        {
            var existing = await _context.Visits.FindAsync(id);
            if (existing == null) return false;

            existing.StartTime = visit.StartTime;
            existing.EndTime = visit.EndTime;
            existing.Comment = visit.Comment;
            existing.VisitTypeId = visit.VisitTypeId;
            existing.EmployeeId = visit.EmployeeId;
            existing.PatientId = visit.PatientId;

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
