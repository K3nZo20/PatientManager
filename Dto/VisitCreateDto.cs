namespace PatientManager.Api.DTOs
{
    public class VisitCreateDto
    {
        public Guid PatientId { get; set; }
        public Guid EmployeeId { get; set; }
        public int VisitTypeId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Comment { get; set; }
    }
}
