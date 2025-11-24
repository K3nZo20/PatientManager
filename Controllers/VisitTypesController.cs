using Microsoft.AspNetCore.Mvc;
using PatientManager.Api.DTOs;
using PatientManager.Api.Entities;
using PatientManager.Api.Services;

namespace PatientManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitTypesController : ControllerBase
    {
        private readonly IVisitTypeService _service;
        public VisitTypesController(IVisitTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? sortBy,
            [FromQuery] bool sortByDescending,
            [FromQuery] int page = 1,
            [FromQuery] int? pageSize = null)


        {
                var result = await _service.GetAllAsync(search, sortBy, sortByDescending, page, pageSize ?? 0);
                return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVisitTypeAsync(int id)
        {
            var visitType = await _service.GetByIdAsync(id);
            if (visitType == null) return NotFound();
            return Ok(visitType);
        }

        [HttpPost]
        public async Task<IActionResult> AddVisitTypeAsync([FromBody] VisitType visitType)
        {
            var created = await _service.CreateVisitTypeAsync(visitType);
            return Ok(created.Data);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVisitType(int id, [FromBody] VisitType visitType)
        {
            var updated = await _service.UpdateVisitTypeAsync(id, visitType);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitType(int id)
        {
            var delete = await _service.DeleteVisitTypeAsync(id);
            if (!delete) return NotFound();
            return NoContent();
        }
    }
}
