using PatientManager.Api.Entities;

namespace PatientManager.Api.Services
{
    public interface IVisitService
    {
        Task<IEnumerable<Visit>> GetAllPatientVisitsAsync(Guid patientId);
        Task<IEnumerable<Visit>> GetVisitsByDateAsync(DateTime date);
        Task<Visit?> GetByIdAsync(Guid id);
        Task<Visit> CreateAsync(Visit visit);
        Task<bool> UpdateAsync(Guid id, Visit visit);
        Task<bool> DeleteAsync(Guid id);
    }
}
