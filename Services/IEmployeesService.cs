using PatientManager.Api.Entities;
using PatientManager.Api.Models;

namespace PatientManager.Api.Services
{
    public interface IEmployeesService
    {
        Task<PagedResultDto<Employee>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize);
        Task<Employee> CreateAsync(Employee employee);
        Task<Employee?> GetByIdAsync(Guid id);
    }
}
