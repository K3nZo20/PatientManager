using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatientManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeVisitTypeName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_TypeId",
                table: "Visits");

            migrationBuilder.RenameColumn(
                name: "TypeId",
                table: "Visits",
                newName: "VisitTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Visits_TypeId",
                table: "Visits",
                newName: "IX_Visits_VisitTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits",
                column: "VisitTypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits");

            migrationBuilder.RenameColumn(
                name: "VisitTypeId",
                table: "Visits",
                newName: "TypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Visits_VisitTypeId",
                table: "Visits",
                newName: "IX_Visits_TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_TypeId",
                table: "Visits",
                column: "TypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
