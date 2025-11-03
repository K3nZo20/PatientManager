using PatientManager.Api.Entities;

namespace PatientManager.Api.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize);
        Task<Patient?> GetByIdAsync(Guid id);
        Task<Patient> CreateAsync(Patient patient);
        Task<bool> UpdateAsync(Guid id, Patient patient);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AddVisitToPatientAsync(Guid patientId, Visit visit);
    }
}
