using PatientManager.Api.Entities;
using PatientManager.Api.Models;

namespace PatientManager.Api.Services
{
    public interface IPatientService
    {
        Task<PagedResultDto<Patient>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize);
        Task<Patient?> GetByIdAsync(Guid id);
        Task<ServiceResult<Patient>> CreateAsync(Patient patient);
        Task<ServiceResult<Patient>> UpdateAsync(Guid id, Patient patient);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AddVisitToPatientAsync(Guid patientId, Visit visit);
    }
}
