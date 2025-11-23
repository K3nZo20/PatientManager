using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;
using PatientManager.Api.Models;
using System.Linq.Expressions;

namespace PatientManager.Api.Services
{
    public class EmployeesService : IEmployeesService
    {
        private readonly AppDbContext _context;

        public EmployeesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<Employee>> GetAllAsync(string? search, string? sortBy, bool sortByDescending, int page, int pageSize)
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => (p.FirstName.ToLower()).Contains(search.ToLower()) || (p.LastName.ToLower()).Contains(search.ToLower()) || p.PhoneNumber.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                var columnSelector = new Dictionary<string, Expression<Func<Employee, object>>>
                {
                    { nameof(Employee.FirstName), e => e.FirstName },
                    { nameof(Employee.LastName), e => e.LastName }
                };

                sortBy = char.ToUpper(sortBy[0]) + sortBy.Substring(1);
                var sortByExpression = columnSelector[sortBy];
                query = sortByDescending ? query.OrderByDescending(sortByExpression) : query.OrderBy(sortByExpression);
            }

            if (pageSize == 0)
            {
                var all = await query.ToListAsync();
                return new PagedResultDto<Employee>
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

            return new PagedResultDto<Employee>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            return employee;
        }

        public async Task<Employee> CreateAsync(Employee employee)
        {
            employee.Id = Guid.NewGuid();
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<bool> UpdateAsync(Guid id, Employee employee)
        {
            var existing = await _context.Employees.FindAsync(id);
            if (existing == null) return false;

            existing.FirstName = employee.FirstName;
            existing.LastName = employee.LastName;
            existing.PhoneNumber = employee.PhoneNumber;
            existing.Title = employee.Title;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var employee = await GetByIdAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
