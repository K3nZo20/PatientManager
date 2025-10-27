using Microsoft.AspNetCore.Mvc;
using PatientManager.Api.Entities;

namespace PatientManager.Api.Controlers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsControler : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsControler(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var patients = _context.Patients.ToList();
            return Ok(patients);
        }

        [HttpPost]
        public IActionResult Add(Patient patient)
        {
            _context.Patients.Add(patient);
            _context.SaveChanges();
            return Ok(patient);
        }
    }
}
