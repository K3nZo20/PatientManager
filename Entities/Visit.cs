using Microsoft.Extensions.Primitives;
using System.Data;

namespace PatientManager.Api.Entities
{
    public class Visit
    {
        public Guid Id { get; set; }
        public string? Comment { get; set; }
        public VisitType VisitType { get; set; }
        public int VisitTypeId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Patient Patient { get; set; }
        public Guid PatientId { get; set; }
        public Employee Employee { get; set; }
        public Guid EmployeeId { get; set; }

    }
}
