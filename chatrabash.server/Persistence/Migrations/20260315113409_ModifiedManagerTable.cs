using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedManagerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ManagerName",
                table: "Hostels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerPhone",
                table: "Hostels",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManagerName",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "ManagerPhone",
                table: "Hostels");
        }
    }
}
