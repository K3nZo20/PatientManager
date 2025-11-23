using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;
using PatientManager.Api.Models;
using System.Linq.Expressions;


namespace PatientManager.Api.Services
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;

        public PatientService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResultDto<Patient>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => (p.FirstName.ToLower()).Contains(search.ToLower()) || (p.LastName.ToLower()).Contains(search.ToLower()) || p.PhoneNumber.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                var columnSelector = new Dictionary<string, Expression<Func<Patient, object>>>
                {
                    {nameof(Patient.FirstName), p => p.FirstName},
                    {nameof(Patient.LastName), p => p.LastName},
                    {nameof(Patient.PhoneNumber), p => p.PhoneNumber},
                    {nameof(Patient.DateOfBirth), p => p.DateOfBirth},
                    {nameof(Patient.Pesel), p => p.Pesel},
                    {nameof(Patient.PatientTags), p => p.PatientTags},
                    {nameof(Patient.Visits), p => p.Visits},
                };

                sortBy = char.ToUpper(sortBy[0]) + sortBy.Substring(1);
                var sortByExpression = columnSelector[sortBy];
                query = sortByDescending ? query.OrderByDescending(sortByExpression) : query.OrderBy(sortByExpression);
            }

            if (pageSize == 0)
            {
                var all = await query.ToListAsync();
                return new PagedResultDto<Patient>
                {
                    Items = all,
                    TotalCount = all.Count,
                    Page = page,
                    PageSize = pageSize
                };
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<Patient>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<Patient?> GetByIdAsync(Guid id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
            return patient;
        }

        public async Task<Patient> CreateAsync(Patient patient)
        {
            patient.Id = Guid.NewGuid();
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> UpdateAsync(Guid id, Patient patient)
        {
            var findingPatient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
            if (findingPatient == null) return false;

            findingPatient.FirstName = patient.FirstName;
            findingPatient.LastName = patient.LastName;
            findingPatient.PhoneNumber = patient.PhoneNumber;
            findingPatient.Pesel = patient.Pesel;
            findingPatient.DateOfBirth = patient.DateOfBirth;
            findingPatient.Visits = patient.Visits;
            findingPatient.PatientTags = patient.PatientTags;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null) return false;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddVisitToPatientAsync(Guid patientId, Visit visit)
        {
            Patient patient = await GetByIdAsync(patientId);
            if (patient == null) return false;
            patient.Visits.Add(visit);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
