namespace PatientManager.Api.Entities
{
    public class PatientTag
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public List<Patient> Patients { get; set; } = new List<Patient>();
    }
}
