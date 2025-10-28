using Microsoft.Extensions.Primitives;
using System.Data;

namespace PatientManager.Api.Entities
{
    public class Visit
    {
        public int Id { get; set; }
        public string? Comment { get; set; }
        public VisitType Type { get; set; }
        public int TypeId { get; set; }
        public DateTime VisitDate { get; set; }
        public Patient Patient { get; set; }
        public int PatientId { get; set; }
        public Employee Employee { get; set; }
        public Guid EmployeeId { get; set; }

    }
}
