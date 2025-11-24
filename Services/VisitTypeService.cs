using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;
using PatientManager.Api.Models;
using System.Linq.Expressions;

namespace PatientManager.Api.Services
{
    public class VisitTypeService : IVisitTypeService
    {
        private readonly AppDbContext _context;

        public VisitTypeService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResultDto<VisitType>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize)
        {
            var query = _context.VisitTypes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(vt => (vt.Value.ToLower()).Contains(search.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                var columnSelector = new Dictionary<string, Expression<Func<VisitType, object>>>
                {
                    {nameof(VisitType.Value), vt => vt.Value},
                };

                sortBy = char.ToUpper(sortBy[0]) + sortBy.Substring(1);
                var sortByExpression = columnSelector[sortBy];
                query = sortByDescending ? query.OrderByDescending(sortByExpression) : query.OrderBy(sortByExpression);
            }

            if (pageSize == 0)
            {
                var all = await query.ToListAsync();
                return new PagedResultDto<VisitType>
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

            return new PagedResultDto<VisitType>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        public async Task<VisitType?> GetByIdAsync(int id)
        {
            var visitType = await _context.VisitTypes.FirstOrDefaultAsync(vt => vt.Id == id);
            return visitType;
        }

        public async Task<ServiceResult<VisitType>> CreateVisitTypeAsync(VisitType visitType)
        {
            _context.VisitTypes.Add(visitType);
            await _context.SaveChangesAsync();
            return ServiceResult<VisitType>.Ok(visitType);
        }

        public async Task<bool> UpdateVisitTypeAsync(int id, VisitType visitType)
        {
            var findingVisitType = await _context.VisitTypes.FirstOrDefaultAsync(vt => vt.Id == id);
            if (findingVisitType == null) return false;

            findingVisitType.Value = visitType.Value;
            findingVisitType.Color = visitType.Color;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteVisitTypeAsync(int id)
        {
            var visitType = await _context.VisitTypes.FirstOrDefaultAsync(vt => vt.Id == id);
            if (visitType == null) return false;

            _context.VisitTypes.Remove(visitType);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
