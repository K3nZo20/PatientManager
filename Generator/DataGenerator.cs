using Bogus;
using Bogus.Extensions.Poland;
using PatientManager.Api.Entities;

namespace PatientManager.Api.Generator
{
    public class DataGenerator
    {
        public static void GeneratePatients(AppDbContext context, int many)
        {
            var locale = "pl";

            var patientsGenerator = new Faker<Patient>(locale)
                .RuleFor(p => p.Id, f => Guid.NewGuid())
                .RuleFor(p => p.FirstName, f => f.Person.FirstName)
                .RuleFor(p => p.LastName, f => f.Person.LastName)
                .RuleFor(p => p.PhoneNumber, f => f.Random.Number(100000000, 999999999).ToString())
                .RuleFor(p => p.Pesel, f => f.Person.Pesel())
                .RuleFor(p => p.DateOfBirth, f => f.Person.DateOfBirth);

            var patients = patientsGenerator.Generate(many);
            context.AddRange(patients);
            context.SaveChanges();
        }

        public static void GenerateEmployee(AppDbContext context, int many)
        {
            var locale = "pl";
            var titles = new[] { "mgr", "inż.", "dr", "prof.", "" };
            var employeeGenerator = new Faker<Employee>(locale)
                .RuleFor(e => e.Id, f => Guid.NewGuid())
                .RuleFor(e => e.FirstName, f => f.Person.FirstName)
                .RuleFor(e => e.LastName, f => f.Person.LastName)
                .RuleFor(e => e.Title, f => f.PickRandom(titles))
                .RuleFor(e => e.PhoneNumber, f => f.Random.Number(100000000, 999999999).ToString());

            var employees = employeeGenerator.Generate(many);
            context.AddRange(employees);
            context.SaveChanges();
        }
    }
}
