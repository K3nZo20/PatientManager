using Microsoft.AspNetCore.Mvc;
using PatientManager.Api.Entities;
using PatientManager.Api.Models;

namespace PatientManager.Api.Services
{
    public interface IVisitTypeService
    {
        Task<PagedResultDto<VisitType>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize);
        Task<bool> UpdateVisitTypeAsync(int id, [FromBody] VisitType visitType);
        Task<ServiceResult<VisitType>> CreateVisitTypeAsync(VisitType visitType);
        Task<bool> DeleteVisitTypeAsync(int id);
        Task<VisitType?> GetByIdAsync(int id);
    }
}
