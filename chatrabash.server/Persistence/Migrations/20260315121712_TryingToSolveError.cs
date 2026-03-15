using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TryingToSolveError : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ManagerPhone",
                table: "Hostels",
                newName: "ManagerId1");

            migrationBuilder.RenameColumn(
                name: "ManagerName",
                table: "Hostels",
                newName: "ManagerId");

            migrationBuilder.AddColumn<string>(
                name: "HostelId",
                table: "Rooms",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_HostelId",
                table: "Rooms",
                column: "HostelId");

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_ManagerId1",
                table: "Hostels",
                column: "ManagerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_AspNetUsers_ManagerId1",
                table: "Hostels",
                column: "ManagerId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Hostels_HostelId",
                table: "Rooms",
                column: "HostelId",
                principalTable: "Hostels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_AspNetUsers_ManagerId1",
                table: "Hostels");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Hostels_HostelId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_HostelId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_ManagerId1",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "HostelId",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "ManagerId1",
                table: "Hostels",
                newName: "ManagerPhone");

            migrationBuilder.RenameColumn(
                name: "ManagerId",
                table: "Hostels",
                newName: "ManagerName");
        }
    }
}
