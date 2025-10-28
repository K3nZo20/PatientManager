using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatientManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class TablesNamesFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientPatientTag_PatientTag_PatientTagsId",
                table: "PatientPatientTag");

            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Employee_EmployeeId",
                table: "Visits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PatientTag",
                table: "PatientTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employee",
                table: "Employee");

            migrationBuilder.RenameTable(
                name: "PatientTag",
                newName: "PatientTags");

            migrationBuilder.RenameTable(
                name: "Employee",
                newName: "Employees");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PatientTags",
                table: "PatientTags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employees",
                table: "Employees",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientPatientTag_PatientTags_PatientTagsId",
                table: "PatientPatientTag",
                column: "PatientTagsId",
                principalTable: "PatientTags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Employees_EmployeeId",
                table: "Visits",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientPatientTag_PatientTags_PatientTagsId",
                table: "PatientPatientTag");

            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Employees_EmployeeId",
                table: "Visits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PatientTags",
                table: "PatientTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employees",
                table: "Employees");

            migrationBuilder.RenameTable(
                name: "PatientTags",
                newName: "PatientTag");

            migrationBuilder.RenameTable(
                name: "Employees",
                newName: "Employee");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PatientTag",
                table: "PatientTag",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employee",
                table: "Employee",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientPatientTag_PatientTag_PatientTagsId",
                table: "PatientPatientTag",
                column: "PatientTagsId",
                principalTable: "PatientTag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Employee_EmployeeId",
                table: "Visits",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
