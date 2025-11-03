namespace PatientManager.Api.Entities.ViewModels
{
    public class PatientInSearchInfo
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber{ get; set; }
        public List<Visit> Visits { get; set; } = new List<Visit>();

    }
}
