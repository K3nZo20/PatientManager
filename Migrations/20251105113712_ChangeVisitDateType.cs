using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatientManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeVisitDateType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VisitDate",
                table: "Visits",
                newName: "StartTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Visits",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Visits");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Visits",
                newName: "VisitDate");
        }
    }
}
