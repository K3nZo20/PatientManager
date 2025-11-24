using PatientManager.Api.Entities;

namespace PatientManager.Api.Services
{
    public interface IVisitService
    {
        Task<IEnumerable<Visit>> GetAllPatientVisitsAsync(Guid patientId);
        Task<IEnumerable<Visit>> GetVisitsByDateAsync(DateTime date);
        Task<IEnumerable<Visit>> GetVisitsByEmployeeAsync(Guid employeeId);
        Task<IEnumerable<Visit>> GetVisitsByPatientAsync(Guid patientId);
        Task<IEnumerable<Visit>> GetVisitsByEmployeeAndDate(List<Guid> employeesId, DateTime date);
        Task<IEnumerable<Visit>> GetAllVisitsAsync();
        Task<Visit?> GetByIdAsync(Guid id);
        Task<ServiceResult<Visit>> CreateAsync(Visit visit);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, Visit visit);
        Task<bool> DeleteAsync(Guid id);
    }
}
