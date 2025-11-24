using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatientManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveVisitTypeVisitDependecy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits");

            migrationBuilder.AlterColumn<int>(
                name: "VisitTypeId",
                table: "Visits",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits",
                column: "VisitTypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits");

            migrationBuilder.AlterColumn<int>(
                name: "VisitTypeId",
                table: "Visits",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_VisitTypes_VisitTypeId",
                table: "Visits",
                column: "VisitTypeId",
                principalTable: "VisitTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
