using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;
using PatientManager.Api.Services;

namespace PatientManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeesService _service;

        public EmployeesController(IEmployeesService service) 
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployee(
            [FromQuery] string? search,
            [FromQuery] string? sortBy,
            [FromQuery] bool sortByDescending,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {

            var result = await _service.GetAllAsync(search, sortBy, sortByDescending, page, pageSize);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> AddEmployee(Employee employee)
        {
            await _service.CreateAsync(employee);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }
    }
}
