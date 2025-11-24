using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatientManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveVisitTypeVisitDependecy3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits",
                column: "VisitTypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits",
                column: "VisitTypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id");
        }
    }
}
