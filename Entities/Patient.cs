namespace PatientManager.Api.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Pesel {  get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
