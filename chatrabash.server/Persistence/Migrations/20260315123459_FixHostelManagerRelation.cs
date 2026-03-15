using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixHostelManagerRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_AspNetUsers_ManagerId1",
                table: "Hostels");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_ManagerId1",
                table: "Hostels");

            migrationBuilder.DropColumn(
                name: "ManagerId1",
                table: "Hostels");

            migrationBuilder.CreateIndex(
                name: "IX_Hostels_ManagerId",
                table: "Hostels",
                column: "ManagerId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Hostels_AspNetUsers_ManagerId",
                table: "Hostels",
                column: "ManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hostels_AspNetUsers_ManagerId",
                table: "Hostels");

            migrationBuilder.DropIndex(
                name: "IX_Hostels_ManagerId",
                table: "Hostels");

            migrationBuilder.AddColumn<string>(
                name: "ManagerId1",
                table: "Hostels",
                type: "TEXT",
                nullable: true);

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
        }
    }
}
