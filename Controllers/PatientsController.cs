using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatientManager.Api.Entities;
using PatientManager.Api.Services;

namespace PatientManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _service;

        public PatientsController(IPatientService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients(
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
        public async Task<IActionResult> GetPatient(Guid id)
        {
            var patient = await _service.GetByIdAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            var result = await _service.CreateAsync(patient);

            if (!result.Success)
                return BadRequest(new { message = result.Error });

            return CreatedAtAction(nameof(GetPatient), new { id = result.Data!.Id }, result.Data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] Patient patient)
        {
            var result = await _service.UpdateAsync(id, patient);
            if (!result.Success)
                return BadRequest(new { message = result.Error });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(Guid id)
        {
            var delete = await _service.DeleteAsync(id);
            if (!delete) return NotFound();
            return NoContent();
        }

        [HttpPut("{patientId}/visit")]
        public async Task<IActionResult> AddVisitToPatient(Guid patientId, [FromBody] Visit visit)
        {
            var added = await _service.AddVisitToPatientAsync(patientId, visit);
            if (!added) return NotFound();
            return NoContent();
        }
    }
}
