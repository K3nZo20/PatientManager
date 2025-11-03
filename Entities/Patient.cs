namespace PatientManager.Api.Entities
{
    public class Patient
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Pesel {  get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<Visit> Visits { get; set; } = new List<Visit>();
        public List<PatientTag> PatientTags { get; set; }
    }
}
