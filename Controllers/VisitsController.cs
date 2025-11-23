using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PatientManager.Api.DTOs;
using PatientManager.Api.Entities;
using PatientManager.Api.Services;

namespace PatientManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitsController : ControllerBase
    {
        private readonly IVisitService _service;

        public VisitsController(IVisitService service) 
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVisits([FromQuery] List<Guid>? employeeIds, [FromQuery] DateTime date)
        {
            if (employeeIds == null || !employeeIds.Any())
                return Ok(await _service.GetVisitsByDateAsync(date));

            return Ok(await _service.GetVisitsByEmployeeAndDate(employeeIds, date));
        }



        [HttpGet("/byId{id}")]
        public async Task<IActionResult> GetVisitById(Guid id)
        {
            var visit = await _service.GetByIdAsync(id);
            if (visit == null) return NotFound();
            return Ok(visit);
        }

        [HttpGet("byEmployee")]
        public async Task<IActionResult> GetVisitByEmployee([FromQuery] Guid employeeId)
        {
            var visits = await _service.GetVisitsByEmployeeAsync(employeeId);
            if (visits == null) return NotFound();
            return Ok(visits);
        }

        [HttpGet("byPatient")]
        public async Task<IActionResult> GetVisitByPatient([FromQuery] Guid patientId)
        {
            var visits = await _service.GetVisitsByPatientAsync(patientId);
            if (visits == null) return NotFound();
            return Ok(visits);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVisit([FromBody] VisitCreateDto dto)
        {
            try
            {
                var visit = new Visit
                {
                    Id = Guid.NewGuid(),
                    PatientId = dto.PatientId,
                    EmployeeId = dto.EmployeeId,
                    VisitTypeId = dto.VisitTypeId,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    Comment = dto.Comment
                };

                var created = await _service.CreateAsync(visit);
                return CreatedAtAction(nameof(GetVisitById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVisit(Guid id, [FromBody] Visit visit)
        {
            var updated = await _service.UpdateAsync(id, visit);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisit(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
